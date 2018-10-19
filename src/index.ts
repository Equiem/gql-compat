#!/usr/bin/env node

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
  "-o, --old-schema <[committish:]glob-pattern>",
  "A glob pattern matching one or more IDL schema files in the given committish "
  + "in the current repository. If the committish prefix is ommitted the current working copy is used.",
)
.option(
  "-n, --new-schema <[committish:]glob-pattern>",
  "A glob pattern matching one or more IDL schema files in the given committish "
  + "in the current repository. If the committish prefix is ommitted the current working copy is used.",
)
.option(
  "-w, --whitelist <path/to/file>",
  "The path to a whitelist file, which lists incompatibilities that should be ignored. "
  + "You can create this file using the 'whitelist' output format.",
)
.option(
  "-t, --whitelist-tolerance <path/to/file>",
  "The length of time in seconds for which whitelisted breakages are valid",
  parseInt,
  7 * 24 * 60 * 60,
)
.option(
  "-f, --format <pretty|whitelist>",
  "The format in which output should be displayed.",
  "pretty",
);

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
