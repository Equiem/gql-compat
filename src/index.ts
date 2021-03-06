#!/usr/bin/env node

import chalk from "chalk";
import program from "commander";
import fs from "fs";
import { getLogger } from "log4js";
import path from "path";
import shell from "shelljs";
import { CommandOptions } from "./CommandOptions";
import { compare } from "./compare";
import { IGNORE_FILE } from "./config";
import { findBreakingChanges } from "./findBreakingChanges";
import { ignoreBreakingChanges } from "./ignoreBreakingChanges";
import { reportBreakingChanges } from "./reportBreakingChanges";

const mainLogger = getLogger();
mainLogger.level = process.env.LOG_LEVEL != null ? process.env.LOG_LEVEL : "error";

const exec = async (action: () => Promise<number>): Promise<void> => {
  try {
    process.exit(await action());
  }
  catch (e) {
    mainLogger.error(`${e}`);
    if (e instanceof Error && e.stack != null) {
      mainLogger.debug(e.stack);
    }
    process.exit(1);
  }
};

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")).toString()) as { version: string };
program.name("gql-compat").version(pkg.version);

program
  .command("check <old-schema-locator> <new-schema-locator>")
  .option(
    "-t, --ignore-tolerance <seconds>",
    "The length of time for which ignored breakages are ignored.",
    parseInt,
    7 * 24 * 60 * 60,
  )
  .option(
    "-i, --ignored",
    "Don't ignore breaking changes in .gql-compat-ignore file.",
  )
  .action(async (oldLocator: string, newLocator: string, options: CommandOptions): Promise<void> => exec(async () => {
    const changes = await findBreakingChanges(oldLocator, newLocator, IGNORE_FILE, options);
    changes.breaking = options.ignored ? changes.breaking.concat(changes.ignored) : changes.breaking;
    reportBreakingChanges(changes.breaking, changes.ignored);

    return changes.breaking.length === 0 ? 0 : 1;
  }));

program
  .command("compare <old-schema-locator> <new-schema-locator>")
  .action(async (oldLocator: string, newLocator: string): Promise<void> => exec(async () => {
    shell.echo(await compare(oldLocator, newLocator));

    return 0;
  }));

program
  .command("ignore <old-schema-locator> <new-schema-locator>")
  .action(async (oldLocator: string, newLocator: string, options: CommandOptions): Promise<void> => exec(async () => {
    const changes = await findBreakingChanges(oldLocator, newLocator, IGNORE_FILE, options);
    ignoreBreakingChanges(changes.breaking, IGNORE_FILE);

    return 0;
  }));

program.on("command:*", () => {
  shell.echo(`Invalid command: ${program.args.join(" ")}\nSee --help for a list of available commands.`);
  process.exit(1);
});

program.on("--help", () => {
  shell.echo(`

${chalk.bold.underline("Locators")}

Locators are a string representing one or more files, either in the current
working directory, in a committish in the currently active git repository, or
in an npm package.

  glob                  eg. path/to/**/*.graphql
  committish:pattern    eg. origin/master:path/to/*/*.graphql
  npm:package:glob      eg. npm:@my-scope/@my-module@1.2.3:path/to/*/*.graphql

Note that committish:patterns follow the rules of the git ls-files command which
is not the same as a glob.`,
  );
});

program.parse(process.argv);
