import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { slow, suite, test, timeout } from "mocha-typescript";
import mock from "mock-fs";
import shelljs from "shelljs";
import td from "testdouble";
import { loadSchema } from "./loadSchema";

chaiUse(chaiAsPromised);

// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression

/**
 * Tests for the Environment.
 */
@suite(timeout(300), slow(50))
export class LoadSchemaSpec {
  public after(): void {
    mock.restore();
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

  @test("check for presence of git")
  public async checkForGit(): Promise<void> {
    const shell = td.object<typeof shelljs>("shell");
    const committish = "master";
    const glob = "src/**/*.graphql";

    td.when(shell.which("git")).thenReturn(false);

    expect(loadSchema({ committish, glob }, shell)).to.eventually.be.rejectedWith("Sorry, this script requires git");
  }

  @test("load schema from committish:glob pattern")
  public async loadCommittishGlobPattern(): Promise<void> {
    const shell = td.object<typeof shelljs>("shell");
    const committish = "master";
    const glob = "src/**/*.graphql";

    td.when(shell.which("git")).thenReturn(true);

    td.when(
      shell.exec(`for file in $(git ls-tree ${committish} -r --name-only ${glob}); `
        + `do git show ${committish}:$file; echo '';`
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

    const schema = await loadSchema({ committish, glob }, shell);
    const user = schema.getType("User");
    const product = schema.getType("Product");

    expect(user).not.to.be.undefined;
    expect(product).not.to.be.undefined;
  }
}
