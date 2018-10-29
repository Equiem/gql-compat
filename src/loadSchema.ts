import fs from "fs";
import globPromise from "glob-promise";
import { buildClientSchema, buildSchema, getIntrospectionQuery, GraphQLSchema, IntrospectionQuery } from "graphql";
import request from "request-promise-native";
import shell from "shelljs";
import { ExecOutputReturnValue } from "shelljs";
import { FileLocator } from "./FileLocator";

/**
 * Parses a file locator string pattern.
 */
export const loadSchema = async (locator: FileLocator): Promise<GraphQLSchema>  => {
  if (locator.committish == null && locator.glob != null) {
    const files = await globPromise(locator.glob);
    const data = files.map((name) => fs.readFileSync(name)).join("\n\n").trim();
    if (data.length === 0) {
      throw new Error(`Could not find schema at ${locator.glob}`);
    }

    return buildSchema(data);
  }
  else if (locator.committish != null && locator.glob != null) {
    const committish = locator.committish;
    const glob = locator.glob;

    if (!shell.which("git")) {
      throw new Error("Sorry, this script requires git");
    }

    const result = shell.exec(`for file in $(git ls-files --with-tree=${committish} '${glob}'); `
      + `do git show ${committish}:$file; echo '';`
      + "done;",
      { silent: true },
    ) as ExecOutputReturnValue;

    if (result.code !== 0) {
      throw new Error(result.stderr);
    }

    const data = result.stdout.trim();
    if (data.length === 0) {
      throw new Error(`Could not find schema at ${locator.committish}:${locator.glob}`);
    }

    return buildSchema(result.stdout);
  }
  else if (locator.url != null) {
    const { data, errors } = await request({
      json: {
        query: getIntrospectionQuery(),
      },
      method: "POST",
      url: locator.url,
    }) as { data: IntrospectionQuery; errors?: any};

    if (errors != null) {
      throw new Error(JSON.stringify(errors, null, 2));
    }

    return buildClientSchema(data);
  }
  else {
    throw new Error(`Invalid locator provided: ${locator}`);
  }
};
