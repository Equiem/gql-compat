// Must be imported before reportBreakingChanges.
import shell from "./mocks/shelljs";

import { use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import chalk from "chalk";
import { BreakingChange } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import sinon from "sinon";
import td from "testdouble";
import { formatBreakingChanges } from "./formatBreakingChanges";
import { reportBreakingChanges } from "./reportBreakingChanges";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class ReportBreakingChangesSpec {
  public static after(): void {
    td.reset();
  }

  private clock: sinon.SinonFakeTimers;
  private breakingChanges: BreakingChange[] = [
    { type: "FIELD_REMOVED", description: "User.uuid was removed" },
    { type: "FIELD_REMOVED", description: "User.name was removed" },
  ];

  public before(): void {
    this.clock = sinon.useFakeTimers({ now: new Date() });
  }

  public after(): void {
    this.clock.restore();
    td.reset();
  }

  @test("report no breaking changes in pretty format")
  public prettyNoBreakingChanges(): void {
    reportBreakingChanges([], []);
    td.verify(
      shell.echo(`👍 ${chalk.bold.green("The new schema does not introduce any unintentional breaking changes")}`),
    );
  }

  @test("report breaking changes in pretty format")
  public prettyBreakingChanges(): void {
    reportBreakingChanges(this.breakingChanges, []);

    td.verify(
      shell.echo(`💥 ${chalk.bold.red("2 breaking changes were detected")}`),
    );
    td.verify(
      shell.echo(formatBreakingChanges(this.breakingChanges)),
    );
  }

  @test("report no breaking changes in pretty format as well as ignored")
  public prettyNoBreakingChangesPlusIgnored(): void {
    const ignored: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "Product.uuid was removed" },
    ];
    reportBreakingChanges([], ignored);

    td.verify(
      shell.echo(`👀 ${chalk.bold.yellow("1 breaking change was ignored")}`),
    );
    td.verify(
      shell.echo(formatBreakingChanges(ignored)),
    );

    td.verify(
      shell.echo(`👍 ${chalk.bold.green("The new schema does not introduce any unintentional breaking changes")}`),
    );
  }

  @test("report breaking changes in pretty format as well as ignored")
  public prettyBreakingChangesPlusIgnored(): void {
    const ignored: BreakingChange[] = [
      { type: "FIELD_REMOVED", description: "Product.uuid was removed" },
    ];
    reportBreakingChanges(this.breakingChanges, ignored);

    td.verify(
      shell.echo(`👀 ${chalk.bold.yellow("1 breaking change was ignored")}`),
    );
    td.verify(
      shell.echo(formatBreakingChanges(ignored)),
    );

    td.verify(
      shell.echo(`💥 ${chalk.bold.red("2 breaking changes were detected")}`),
    );
    td.verify(
      shell.echo(formatBreakingChanges(this.breakingChanges)),
    );
  }
}
