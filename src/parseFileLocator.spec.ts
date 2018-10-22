import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { slow, suite, test, timeout } from "mocha-typescript";
import { parseFileLocator } from "./parseFileLocator";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class ParseFileLocatorSpec {
  @test("extract a committish and glob pattern")
  public extractCommittishAndGlobPattern(): void {
    const input = "master:src/**/*.graphql";

    const pattern = parseFileLocator(input);

    expect(pattern).to.eql({
      committish: "master",
      glob: "src/**/*.graphql",
    });
  }

  @test("extract a glob pattern only")
  public extractGlobPattern(): void {
    const input = "src/**/*.graphql";

    const pattern = parseFileLocator(input);
    expect(pattern).to.eql({ glob: "src/**/*.graphql" });
  }

  @test("extract an http url")
  public extractHttpUrl(): void {
    const input = "http://example.com/graphql";
    const pattern = parseFileLocator(input);
    expect(pattern).to.eql({ url: input });
  }

  @test("extract an https url")
  public extractHttpsUrl(): void {
    const input = "https://example.com/graphql";
    const pattern = parseFileLocator(input);
    expect(pattern).to.eql({ url: input });
  }
}
