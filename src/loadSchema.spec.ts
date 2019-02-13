// Must be imported before loadSchema.
import shell from "./mocks/shelljs";

import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { getIntrospectionQuery } from "graphql";
import { slow, suite, test, timeout } from "mocha-typescript";
import mock from "mock-fs";
import nock from "nock";
import td from "testdouble";
import { STAGE_DIR } from "./config";
import { FileLocator } from "./FileLocator";
import { loadSchema } from "./loadSchema";
import exampleSchema from "./resources/exampleSchema.json";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class LoadSchemaSpec {
  private nockScope: nock.Scope;

  public after(): void {
    mock.restore();
    td.reset();

    if (this.nockScope != null) {
      this.nockScope.done();
    }
  }

  @test("load schema from glob pattern")
  public async loadGlobPattern(): Promise<void> {
    mock({
      "src/path": {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
    });

    const schema = await loadSchema({ glob: "src/**/*.graphql" });
    const user = schema.getType("User");
    const product = schema.getType("Product");

    expect(user).not.to.be.undefined;
    expect(product).not.to.be.undefined;
  }

  @test("throw useful error on missing schema in filesystem")
  public async loadEmptySchemaFromGlob(): Promise<void> {
    mock({ });
    await expect(loadSchema({ glob: "src/**/*.graphql" })).to.eventually.be.rejectedWith(
      "Could not find schema at src/**/*.graphql",
    );
  }

  @test("check for presence of git")
  public async checkForGit(): Promise<void> {
    const committish = "master";
    const glob = "src/**/*.graphql";

    td.when(shell.which("git")).thenReturn(false);

    await expect(loadSchema({ committish, glob })).to.eventually.be.rejectedWith("Sorry, this script requires git");
  }

  @test("load schema from committish:glob pattern")
  public async loadCommittishGlobPattern(): Promise<void> {
    const committish = "master";
    const glob = "src/**/*.graphql";

    td.when(shell.which("git")).thenReturn(true);

    td.when(
      shell.exec(`for file in $(git ls-files --with-tree=${committish} '${glob}'); `
        + `do git show ${committish}:./$file; echo '';`
        + "done;",
        { silent: true },
      ),
    )
    .thenReturn({
      code: 0,
      stderr: "",
      stdout: `type Product { uuid: String! name: String! }

      type User { firstname: String! lastname: String! }
      `,
    });

    const schema = await loadSchema({ committish, glob });
    const user = schema.getType("User");
    const product = schema.getType("Product");

    expect(user).not.to.be.undefined;
    expect(product).not.to.be.undefined;
  }

  @test("throw useful error on missing schema in git")
  public async loadEmptySchemaFromGit(): Promise<void> {
    const committish = "master";
    const glob = "src/**/*.graphql";

    td.when(shell.which("git")).thenReturn(true);

    td.when(
      shell.exec(`for file in $(git ls-files --with-tree=${committish} '${glob}'); `
        + `do git show ${committish}:$file; echo '';`
        + "done;",
        { silent: true },
      ),
    )
    .thenReturn({ code: 0, stderr: "", stdout: "" });

    await expect(loadSchema({ committish, glob })).to.eventually.be.rejectedWith(
      `Could not find schema at ${committish}:${glob}`,
    );
  }

  @test("load schema by introspecting url")
  public async introspectUrl(): Promise<void> {
    this.nockScope = nock("http://example.com")
      .post("/graphql", {
        query: getIntrospectionQuery(),
      })
      .reply(200, exampleSchema);

    const schema = await loadSchema({ url: "http://example.com/graphql" });
    const profile = schema.getType("Profile");

    expect(profile).not.to.be.undefined;
  }

  @test("check for presence of npm")
  public async checkForNpm(): Promise<void> {
    const locator: FileLocator = { npmPackage: "my-package" };

    td.when(shell.which("npm")).thenReturn(false);

    await expect(loadSchema(locator)).to.eventually.be.rejectedWith("Sorry, this script requires npm");
  }

  @test("check for presence of tar")
  public async checkForTar(): Promise<void> {
    const locator: FileLocator = { npmPackage: "my-package" };

    td.when(shell.which("npm")).thenReturn(true);
    td.when(shell.which("tar")).thenReturn(false);

    await expect(loadSchema(locator)).to.eventually.be.rejectedWith("Sorry, this script requires tar");
  }

  @test("throw error on problem with npm package load or untar")
  public async loadErrorForNpmPattern(): Promise<void> {
    const locator: FileLocator = {
      glob: "*.graphql",
      npmPackage: "my-module",
      scope: "my-scope",
      version: "latest",
    };

    td.when(shell.which("npm")).thenReturn(true);
    td.when(shell.which("tar")).thenReturn(true);

    td.when(
      shell.exec(
        td.matchers.argThat((n) => n.indexOf("npm pack") !== -1 && n.indexOf("tar -xzf") !== -1),
        { silent: true },
      ),
    )
    .thenReturn({ code: 1, stderr: "", stdout: "" });

    expect(loadSchema(locator)).to.eventually.be.rejected;
  }

  @test("throw error if no schema found in npm package")
  public async npmNoSchema(): Promise<void> {
    const locator: FileLocator = {
      glob: "*.graphql",
      npmPackage: "my-module",
      scope: "my-scope",
      version: "latest",
    };

    this.whenNpmPackage(locator, {
      [`${STAGE_DIR}/package`]: { },
    });

    expect(loadSchema(locator)).to.eventually.be.rejectedWith(
      "Could not find schema at @my-scope/my-module@latest:*.graphql",
    );
  }

  @test("load schema from npm:my-module:*.graphql")
  public async loadNpmPattern(): Promise<void> {
    const locator: FileLocator = {
      glob: "src/*.graphql",
      npmPackage: "my-module",
      scope: undefined,
      version: "latest",
    };

    this.whenNpmPackage(locator, {
      [`${STAGE_DIR}/package/src`]: {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
    });

    const schema = await loadSchema(locator);
    expect(schema.getType("User")).not.to.be.undefined;
    expect(schema.getType("Product")).not.to.be.undefined;
  }

  @test("load schema from npm:@my-scope/my-module:*.graphql")
  public async loadScopedNpmPattern(): Promise<void> {
    const locator: FileLocator = {
      glob: "src/*.graphql",
      npmPackage: "my-module",
      scope: "my-scope",
      version: "latest",
    };

    this.whenNpmPackage(locator, {
      [`${STAGE_DIR}/package/src`]: {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
    });

    const schema = await loadSchema(locator);
    expect(schema.getType("User")).not.to.be.undefined;
    expect(schema.getType("Product")).not.to.be.undefined;
  }

  @test("load schema from npm:@my-scope/my-module@1.2.3:*.graphql")
  public async loadScopedVersionedNpmPattern(): Promise<void> {
    const locator: FileLocator = {
      glob: "src/*.graphql",
      npmPackage: "my-module",
      scope: "my-scope",
      version: "1.2.3",
    };

    this.whenNpmPackage(locator, {
      [`${STAGE_DIR}/package/src`]: {
        "product.graphql": "type Product { uuid: String! name: String! }",
        "user.graphql": "type User { firstname: String! lastname: String! }",
      },
    });

    const schema = await loadSchema(locator);
    expect(schema.getType("User")).not.to.be.undefined;
    expect(schema.getType("Product")).not.to.be.undefined;
  }

  @test("delete downloaded package after extraction")
  public async deleteNpmPackage(): Promise<void> {
    const locator: FileLocator = {
      glob: "src/*.graphql",
      npmPackage: "my-module",
      scope: "my-scope",
      version: "latest",
    };
    this.whenNpmPackage(locator, {
      [`${STAGE_DIR}/package/src`]: { "product.graphql": "type Product { uuid: String! name: String! }" },
    });

    await loadSchema(locator);
    td.verify(shell.exec(`rm -rf ${STAGE_DIR}`, { silent: true }));
  }

  private whenNpmPackage(locator: FileLocator, filesystem: mock.Config): void {
    td.when(shell.which("npm")).thenReturn(true);
    td.when(shell.which("tar")).thenReturn(true);

    const packageName = `${locator.scope != null ? `@${locator.scope}/` : ""}${locator.npmPackage}@${locator.version}`;
    const download = `${locator.scope != null ? `${locator.scope}-` : ""}${locator.npmPackage}*.tgz`;

    td.when(
      shell.exec(
        `set -x
        mkdir -p ${STAGE_DIR}
        cd ${STAGE_DIR}
        npm pack ${packageName}
        tar -xzf ${download}`,
        { silent: true },
      ),
    )
    .thenReturn({ code: 0, stderr: "", stdout: "" });

    mock(filesystem);
  }
}
