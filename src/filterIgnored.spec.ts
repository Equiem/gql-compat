import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BreakingChange } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import mock from "mock-fs";
import sinon from "sinon";
import { filterIgnored } from "./filterIgnored";
import { formatIgnore } from "./formatIgnore";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class FilterIgnoredSpec {
  private clock: sinon.SinonFakeTimers;

  public before(): void {
    this.clock = sinon.useFakeTimers({ now: new Date() });
  }

  public after(): void {
    this.clock.restore();
  }

  @test("don't filter if ignore file missing")
  public missingIgnoreFile(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    mock();

    const filtered = filterIgnored(changes, "path/to/graphql-ignore.json", 1000);
    expect(filtered.length).to.eq(2);
    expect(filtered[0]).to.deep.eq(changes[0]);
    expect(filtered[1]).to.deep.eq(changes[1]);
  }

  @test("filter out ignored breakages within tolerance")
  public filterRecentIgnored(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    const ignore = formatIgnore(changes.slice(0, 1));
    mock({ "path/to/graphql-ignore.json": ignore });

    // Advance time exactly by threshold.
    const tolerance = 1000;
    this.clock.tick(tolerance);

    const filtered = filterIgnored(changes, "path/to/graphql-ignore.json", tolerance);
    expect(filtered.length).to.eq(1);
    expect(filtered[0]).to.deep.eq(changes[1]);
  }

  @test("don't filter out ignored breakages past tolerance")
  public dontFilterOldIgnored(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    const ignore = formatIgnore(changes.slice(0, 1));
    mock({ "path/to/graphql-ignore.json": ignore });

    // Advance time by 1 ms more than threshold.
    const tolerance = 1000;
    this.clock.tick(tolerance + 1);

    const filtered = filterIgnored(changes, "path/to/graphql-ignore.json", tolerance);

    expect(filtered.length).to.eq(2);
    expect(filtered[0]).to.deep.eq(changes[0]);
    expect(filtered[1]).to.deep.eq(changes[1]);
  }

  @test("handle mixture of ignored past and not passed tolerance")
  public mixtedTimstamps(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    const tolerance = 1000;

    const ignoreOld = formatIgnore(changes.slice(0, 1));

    // Advance time by 1ms more than threshold.
    this.clock.tick(tolerance + 1);

    const ignoreCurrent = formatIgnore(changes.slice(0, 1));

    mock({ "path/to/graphql-ignore.json": `${ignoreOld}\n${ignoreCurrent}` });

    const filtered = filterIgnored(changes, "path/to/graphql-ignore.json", tolerance);

    expect(filtered.length).to.eq(1);
    expect(filtered[0]).to.deep.eq(changes[1]);
  }

  @test("error on malformed ignore file")
  public malformedIgnoreFile(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
    ];

    mock({ "path/to/graphql-ignore.json": '{ "format: "invalid" }' });

    expect(
      () => filterIgnored(changes, "path/to/graphql-ignore.json", 1000),
    ).to.throw("Malformed ignore file");
  }

  @test("error on malformed JSON in ignore file")
  public malformedJsonIgnoreFile(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
    ];

    mock({ "path/to/graphql-ignore.json": "Malformed data" });

    expect(
      () => filterIgnored(changes, "path/to/graphql-ignore.json", 1000),
    ).to.throw("Malformed ignore file");
  }
}
