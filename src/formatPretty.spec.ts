import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BreakingChange } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import sinon from "sinon";
import { formatPretty } from "./formatPretty";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class FormatPrettySpec {
  private clock: sinon.SinonFakeTimers;

  public before(): void {
    this.clock = sinon.useFakeTimers({ now: new Date() });
  }

  @test("pretty format breaking changes")
  public prettyFormat(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "TYPE_REMOVED", description: "User was removed" },
    ];

    const output = formatPretty(changes);

    expect(output).to.include("Breaking changes were detected");
    expect(output).to.include("FIELD_REMOVED");
    expect(output).to.include("User.uuid was removed");
    expect(output).to.include("TYPE_REMOVED");
    expect(output).to.include("User was removed");
  }
}
