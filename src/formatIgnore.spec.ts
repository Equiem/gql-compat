import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BreakingChange } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import sinon from "sinon";
import { formatIgnore } from "./formatIgnore";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class FormatIgnoreSpec {
  private clock: sinon.SinonFakeTimers;

  public before(): void {
    this.clock = sinon.useFakeTimers({ now: new Date() });
  }

  public after(): void {
    this.clock.restore();
  }

  @test("append current timestamp to each breaking change")
  public appendTimestamp(): void {
    const changes: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "User.uuid was removed" },
      { type: "FIELD_REMOVED", description: "User.name was removed" },
    ];

    const output = formatIgnore(changes).split("\n").map((line) => JSON.parse(line));

    expect(output[0]).to.deep.eq(
      { ...changes[0], timestamp: this.clock.Date().getTime() },
    );

    expect(output[1]).to.deep.eq(
      { ...changes[1], timestamp: this.clock.Date().getTime() },
    );
  }
}
