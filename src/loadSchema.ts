import fs from "fs";
import globPromise from "glob-promise";
import { buildClientSchema, buildSchema, getIntrospectionQuery, GraphQLSchema, IntrospectionQuery } from "graphql";
import request from "request-promise-native";
import shell from "shelljs";
import { ExecOutputReturnValue } from "shelljs";
import { STAGE_DIR } from "./config";
import { FileLocator } from "./FileLocator";

/**
 * Parses a file locator string pattern.
 */
export const loadSchema = async (locator: FileLocator): Promise<GraphQLSchema>  => {
  if (locator.committish == null && locator.npmPackage == null && locator.glob != null) {
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
  else if (locator.npmPackage != null) {
    const download = `${locator.scope != null ? `${locator.scope}-` : ""}${locator.npmPackage}*.tgz`;
    const packageName = `${locator.scope != null ? `@${locator.scope}/` : ""}${locator.npmPackage}@${locator.version}`;

    try {
      if (!shell.which("npm")) {
        throw new Error("Sorry, this script requires npm");
      }
      if (!shell.which("tar")) {
        throw new Error("Sorry, this script requires tar");
      }

      const extractResult = shell.exec(
        `set -x
        mkdir -p ${STAGE_DIR}
        cd ${STAGE_DIR}
        npm pack ${packageName}
        tar -xzf ${download}`,
        { silent: true },
      ) as ExecOutputReturnValue;

      if (extractResult.code !== 0) {
        throw new Error(extractResult.stderr);
      }

      const files = await globPromise(`${STAGE_DIR}/package/${locator.glob}`);
      const data = files.map((name) => fs.readFileSync(name)).join("\n\n").trim();
      if (data.length === 0) {
        const pkg = `${locator.scope != null ? `@${locator.scope}/` : ""}${locator.npmPackage}@${locator.version}`;
        throw new Error(`Could not find schema at ${pkg}:${locator.glob}`);
      }

      return buildSchema(data);
    }
    catch (e) {
      throw e;
    }
    finally {
      shell.exec(`rm -rf ${STAGE_DIR}`, { silent: true });
    }
  }
  else {
    throw new Error(`Invalid locator provided: ${locator}`);
  }
};
