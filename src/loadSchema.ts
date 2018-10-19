import fs from "fs";
import globPromise from "glob-promise";
import { buildSchema, GraphQLSchema } from "graphql";
import shelljs from "shelljs";
import { ExecOutputReturnValue } from "shelljs";
import { FileLocator } from "./FileLocator";

/**
 * Parses a file locator string pattern.
 */
export const loadSchema = async (locator: FileLocator, shell?: typeof shelljs): Promise<GraphQLSchema>  => {
  if (locator.committish == null) {
    const files = await globPromise(locator.glob);
    const data = files.map((name) => fs.readFileSync(name)).join("\n\n");

    return buildSchema(data);
  }
  else {
    const sh = shell != null ? shell : shelljs;
    const committish = locator.committish;
    const glob = locator.glob;

    if (!sh.which("git")) {
      throw new Error("Sorry, this script requires git");
    }

    const result = sh.exec(`for file in $(git ls-tree ${committish} -r --name-only ${glob}); `
      + `do git show ${committish}:$file; echo '';`
      + "done;",
      { silent: true },
    ) as ExecOutputReturnValue;

    if (result.code !== 0) {
      throw new Error(result.stderr);
    }

    return buildSchema(result.stdout);
  }
};
