// Must be imported before fs.
import mock from "mock-fs";
// Must be imported before ignoreBreakingChanges.
import shell from "./mock/shelljs";

import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import chalk from "chalk";
import fs from "fs";
import { BreakingChange } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import sinon from "sinon";
import td from "testdouble";
import { formatIgnore } from "./formatIgnore";
import { ignoreBreakingChanges } from "./ignoreBreakingChanges";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class IgnoreBreakingChangesSpec {
  private clock: sinon.SinonFakeTimers;
  private breakingChanges: BreakingChange[] = [
    { type: "FIELD_REMOVED", description: "User.uuid was removed" },
    { type: "FIELD_REMOVED", description: "User.name was removed" },
  ];

  public before(): void {
    this.clock = sinon.useFakeTimers(new Date());
  }

  public after(): void {
    this.clock.restore();
  }

  @test("don't create an empty ignore file")
  public dontCreateEmptyFile(): void {
    const ignoreFile = ".gql-compat-ignore";
    mock();

    ignoreBreakingChanges([], ignoreFile);
    expect(fs.existsSync(ignoreFile), "Ignore file should NOT exist").to.be.false;

    td.verify(
      shell.echo(chalk.bold.green("No breaking changes to ignore.")),
    );
  }

  @test("write breaking changes to newly created ignore file")
  public createIgnoreFile(): void {
    const ignoreFile = ".gql-compat-ignore";
    mock();

    ignoreBreakingChanges(this.breakingChanges, ignoreFile);

    expect(fs.existsSync(ignoreFile), "Ignore file should exist").to.be.true;
    expect(fs.readFileSync(ignoreFile).toString()).to.eq(
      `${formatIgnore(this.breakingChanges)}\n`,
    );

    td.verify(shell.echo(chalk.bold.green(`Wrote 2 breaking changes to ${ignoreFile}.`)));
  }

  @test("append breaking changes to new line in existing ignore file")
  public appendToIgnoreFile(): void {
    const ignoreFile = ".gql-compat-ignore";
    mock();

    ignoreBreakingChanges(this.breakingChanges.slice(0, 1), ignoreFile);
    ignoreBreakingChanges(this.breakingChanges.slice(1, 2), ignoreFile);

    expect(fs.existsSync(ignoreFile), "Ignore file should exist").to.be.true;
    expect(fs.readFileSync(ignoreFile).toString()).to.eq(
      `${formatIgnore(this.breakingChanges)}\n`,
    );

    td.verify(
      shell.echo(chalk.bold.green(`Wrote 1 breaking change to ${ignoreFile}.`)),
      { times: 2 },
    );
  }
}
