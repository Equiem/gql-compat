import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { slow, suite, test, timeout } from "mocha-typescript";
import mock from "mock-fs";
import { compare } from "./compare";
import { CompareResult } from "./CompareResult";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class CompareSpec {
  @test("Detect incompatible changes")
  public async incompatibleChanges(): Promise<void> {
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

    const expected: CompareResult = "incompatible-change";
    await expect(compare("src/version1/*.graphql", "src/version2/*.graphql")).to.eventually.eq(expected);
  }

  @test("Detect compatible changes")
  public async compatibleChanges(): Promise<void> {
    mock({
      "src/version1": {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
      "src/version2": {
        "product.graphql": "type Product { uuid: String! name: String! sku: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
    });

    const expected: CompareResult = "compatible-change";
    await expect(compare("src/version1/*.graphql", "src/version2/*.graphql")).to.eventually.eq(expected);
  }

  @test("Detect has no changes")
  public async noChanges(): Promise<void> {
    mock({
      "src/version1": {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
      "src/version2": {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
    });

    const expected: CompareResult = "no-change";
    await expect(compare("src/version1/*.graphql", "src/version2/*.graphql")).to.eventually.eq(expected);
  }
}
