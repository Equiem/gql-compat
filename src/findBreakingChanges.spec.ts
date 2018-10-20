import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import chalk from "chalk";
import { slow, suite, test, timeout } from "mocha-typescript";
import mock from "mock-fs";
import shelljs from "shelljs";
import sinon from "sinon";
import td from "testdouble";
import { IGNORE_FILE } from "./config";
import { findBreakingChanges } from "./findBreakingChanges";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class FindBreakingChangesSpec {
  private clock: sinon.SinonFakeTimers;
  private shell: typeof shelljs;

  public before(): void {
    this.clock = sinon.useFakeTimers();
    this.shell = td.object<typeof shelljs>("shell");
  }

  public after(): void {
    this.clock.restore();
  }

  @test("find breaking changes")
  public async findBreakingChanges(): Promise<void> {
    mock({
      "src/version1": {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
      "src/version2": {
        "product.graphql": "type Product { name: String! }",
        "user.graphql": "type User { firstname: Int! lastname: String! }",
      },
    });

    const breakingChanges = await findBreakingChanges(
      "src/version1/*.graphql",
      "src/version2/*.graphql",
      ".gql-compat-ignore",
      { ignoreTolerance: 1000 },
      this.shell,
    );

    expect(breakingChanges).to.eql([
      {
        description: "Product.uuid was removed.",
        type: "FIELD_REMOVED",
      },
      {
        description: "User.firstname changed type from String! to Int!.",
        type: "FIELD_CHANGED_KIND",
      },
    ]);
  }

  @test("report ignored changes")
  public async reporting(): Promise<void> {
    mock({
      [IGNORE_FILE]: '{"description":"Product.uuid was removed.","type":"FIELD_REMOVED","timestamp":0}',
      "src/version1": {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
      "src/version2": {
        "product.graphql": "type Product { name: String! }",
        "user.graphql": "type User { firstname: Int! lastname: String! }",
      },
    });

    const breakingChanges = await findBreakingChanges(
      "src/version1/*.graphql",
      "src/version2/*.graphql",
      ".gql-compat-ignore",
      { ignoreTolerance: 1000 },
      this.shell,
    );

    expect(breakingChanges).to.eql([
      {
        description: "User.firstname changed type from String! to Int!.",
        type: "FIELD_CHANGED_KIND",
      },
    ]);

    td.verify(
      this.shell.echo(chalk.yellow("Ignored 1 breaking change in .gql-compat-ignore.")),
    );
  }
}
