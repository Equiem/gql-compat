import { use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import chalk from "chalk";
import { BreakingChange } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import shelljs from "shelljs";
import sinon from "sinon";
import td from "testdouble";
import { formatPretty } from "./formatPretty";
import { reportBreakingChanges } from "./reportBreakingChanges";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class ReportBreakingChangesSpec {
  private clock: sinon.SinonFakeTimers;
  private shell: typeof shelljs;
  private breakingChanges: BreakingChange[] = [
    { type: "FIELD_REMOVED", description: "User.uuid was removed" },
    { type: "FIELD_REMOVED", description: "User.name was removed" },
  ];

  public before(): void {
    this.clock = sinon.useFakeTimers({ now: new Date() });
    this.shell = td.object<typeof shelljs>("shell");
  }

  public after(): void {
    this.clock.restore();
  }

  @test("report no breaking changes in pretty format")
  public prettyNoBreakingChanges(): void {
    reportBreakingChanges([], this.shell);
    td.verify(
      this.shell.echo(
        `  ✨  ${chalk.bold.green("The new schema does not introduce any unintentional breaking changes")}`,
      ),
    );
  }

  @test("report breaking changes in pretty format")
  public prettyBreakingChanges(): void {
    reportBreakingChanges(this.breakingChanges, this.shell);
    td.verify(
      this.shell.echo(formatPretty(this.breakingChanges)),
    );
  }
}
