import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { buildSchema } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import mock from "mock-fs";
import sinon from "sinon";
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

  public before(): void {
    this.clock = sinon.useFakeTimers();
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
      IGNORE_FILE,
      { ignoreTolerance: 1000, ignored: false },
    );

    expect(breakingChanges).to.eql({
      breaking: [
        {
          description: "Product.uuid was removed.",
          type: "FIELD_REMOVED",
        },
        {
          description: "User.firstname changed type from String! to Int!.",
          type: "FIELD_CHANGED_KIND",
        },
      ],
      ignored: [],
    });
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
      IGNORE_FILE,
      { ignoreTolerance: 1000, ignored: false },
    );

    expect(breakingChanges).to.eql({
      breaking: [
        {
          description: "User.firstname changed type from String! to Int!.",
          type: "FIELD_CHANGED_KIND",
        },
      ],
      ignored: [
        {
          description: "Product.uuid was removed.",
          type: "FIELD_REMOVED",
        },
      ],
    });
  }

  @test("skip ignore rules if ommitted")
  public async skipIgnore(): Promise<void> {
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
    );

    expect(breakingChanges).to.eql({
      breaking: [
        {
          description: "Product.uuid was removed.",
          type: "FIELD_REMOVED",
        },
        {
          description: "User.firstname changed type from String! to Int!.",
          type: "FIELD_CHANGED_KIND",
        },
      ],
      ignored: [],
    });
  }

  @test("skip ignore rules if option specified")
  public async ignoredOption(): Promise<void> {
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
      IGNORE_FILE,
      { ignoreTolerance: 1000, ignored: true },
    );

    expect(breakingChanges).to.eql({
      breaking: [
        {
          description: "Product.uuid was removed.",
          type: "FIELD_REMOVED",
        },
        {
          description: "User.firstname changed type from String! to Int!.",
          type: "FIELD_CHANGED_KIND",
        },
      ],
      ignored: [],
    });
  }

  @test("compare pre-built scheas")
  public async preBuiltSchemas(): Promise<void> {
    mock({
      [IGNORE_FILE]: '{"description":"Product.uuid was removed.","type":"FIELD_REMOVED","timestamp":0}',
    });

    const breakingChanges = await findBreakingChanges(
      buildSchema("type Product { uuid: String! name: String! }\n\ntype User { firstname: String! lastname: String! }"),
      buildSchema("type Product { name: String! }\n\ntype User { firstname: Int! lastname: String! }"),
      IGNORE_FILE,
      { ignoreTolerance: 1000, ignored: false },
    );

    expect(breakingChanges).to.eql({
      breaking: [
        {
          description: "User.firstname changed type from String! to Int!.",
          type: "FIELD_CHANGED_KIND",
        },
      ],
      ignored: [
        {
          description: "Product.uuid was removed.",
          type: "FIELD_REMOVED",
        },
      ],
    });
  }
}
