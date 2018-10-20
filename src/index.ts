#!/usr/bin/env node

import chalk from "chalk";
import program from "commander";
import { findBreakingChanges } from "graphql";
import { getLogger, Logger } from "log4js";
import shell from "shelljs";
import { CommandOptions } from "./CommandOptions";
import { filterWhitelisted } from "./filterWhitelisted";
import { loadSchema } from "./loadSchema";
import { parseFileLocator } from "./parseFileLocator";
import { reportBreakingChanges } from "./reportBreakingChanges";

const cmd = program
.name("gql-compat")
.version("0.0.1")
.option(
  "-o, --old-schema <locator>",
  "The location of one or more IDL schema files.",
)
.option(
  "-n, --new-schema <locator>",
  "The location of one or more IDL schema files.",
)
.option(
  "-w, --whitelist <path/to/file>",
  "The path to a whitelist file, listing incompatibilities to be ignored.",
)
.option(
  "-t, --whitelist-tolerance <seconds>",
  "The length of time for which whitelisted breakages are ignored.",
  parseInt,
  7 * 24 * 60 * 60,
)
.option(
  "-f, --format <pretty|whitelist>",
  "The output format. Use 'whitelist' to generate contents of a whitelist file.",
  "pretty",
);

program.on("--help", () => {
  shell.echo(`

${chalk.bold.underline("Locators")}

Locators are a string representing one or more files, either in the current
working directory or in a committish in the currently active git repository.

  glob                  eg. path/to/**/*.graphql
  committish:pattern    eg. origin/master:path/to/*/*.graphql

Note that committish:patterns follow the rules of the git ls-tree command which
is not the same as a glob.`,
  );
});

/**
 * The main program entry point.
 */
const main = async (command: program.Command): Promise<void> => {
  if (!CommandOptions.guard(command)) {
    shell.echo("Invalid options provided.\n");
    program.outputHelp();

    return;
  }

  const [oldSchema, newSchema] = await Promise.all([
    loadSchema(parseFileLocator(command.oldSchema), shell),
    loadSchema(parseFileLocator(command.newSchema), shell),
  ]);

  let breakingChanges = findBreakingChanges(oldSchema, newSchema);
  if (command.whitelist != null) {
    breakingChanges = filterWhitelisted(
      breakingChanges,
      command.whitelist,
      command.whitelistTolerance * 1000,
    );
  }

  reportBreakingChanges(breakingChanges, command.format, shell);

  process.exit(breakingChanges.length === 0 ? 0 : 1);
};

const mainLogger = getLogger();
mainLogger.level = process.env.LOG_LEVEL != null ? process.env.LOG_LEVEL : "error";

/**
 * Execute the program.
 */
main(cmd.parse(process.argv)).catch((err) => {
  mainLogger.error(`${err}`);
  process.exit(1);
});
