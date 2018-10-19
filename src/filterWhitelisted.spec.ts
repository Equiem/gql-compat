import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BreakingChange } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import mock from "mock-fs";
import sinon from "sinon";
import { filterWhitelisted } from "./filterWhitelisted";
import { formatWhitelist } from "./formatWhitelist";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class FilterWhitelistedSpec {
  private clock: sinon.SinonFakeTimers;

  public before(): void {
    this.clock = sinon.useFakeTimers({ now: new Date() });
  }

  public after(): void {
    this.clock.restore();
  }

  @test("filter out whitelisted breakages within tolerance")
  public filterRecentWhitelisted(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    const whitelist = formatWhitelist(changes.slice(0, 1));
    mock({ "path/to/graphql-whitelist.json": whitelist });

    // Advance time exactly by threshold.
    const tolerance = 1000;
    this.clock.tick(tolerance);

    const filtered = filterWhitelisted(changes, "path/to/graphql-whitelist.json", tolerance);
    expect(filtered.length).to.eq(1);
    expect(filtered[0]).to.deep.eq(changes[1]);
  }

  @test("don't filter out whitelisted breakages past tolerance")
  public dontFilterOldWhitelisted(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    const whitelist = formatWhitelist(changes.slice(0, 1));
    mock({ "path/to/graphql-whitelist.json": whitelist });

    // Advance time by 1 ms more than threshold.
    const tolerance = 1000;
    this.clock.tick(tolerance + 1);

    const filtered = filterWhitelisted(changes, "path/to/graphql-whitelist.json", tolerance);

    expect(filtered.length).to.eq(2);
    expect(filtered[0]).to.deep.eq(changes[0]);
    expect(filtered[1]).to.deep.eq(changes[1]);
  }

  @test("handle mixture of whitelisted past and not passed tolerance")
  public mixtedTimstamps(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    const tolerance = 1000;

    const whitelistOld = formatWhitelist(changes.slice(0, 1));

    // Advance time by 1ms more than threshold.
    this.clock.tick(tolerance + 1);

    const whitelistCurrent = formatWhitelist(changes.slice(0, 1));

    mock({ "path/to/graphql-whitelist.json": `${whitelistOld}\n${whitelistCurrent}` });

    const filtered = filterWhitelisted(changes, "path/to/graphql-whitelist.json", tolerance);

    expect(filtered.length).to.eq(1);
    expect(filtered[0]).to.deep.eq(changes[1]);
  }

  @test("error on malformed whitelist file")
  public malformedWhitelistFile(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
    ];

    mock({ "path/to/graphql-whitelist.json": '{ "format: "invalid" }' });

    expect(
      () => filterWhitelisted(changes, "path/to/graphql-whitelist.json", 1000),
    ).to.throw("Malformed whitelist file");
  }

  @test("error on malformed JSON in whitelist file")
  public malformedJsonWhitelistFile(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
    ];

    mock({ "path/to/graphql-whitelist.json": "Malformed data" });

    expect(
      () => filterWhitelisted(changes, "path/to/graphql-whitelist.json", 1000),
    ).to.throw("Malformed whitelist file");
  }
}
