#!/usr/bin/env node

import program from "commander";
import { findBreakingChanges } from "graphql";
import { getLogger, Logger } from "log4js";
import shell from "shelljs";
import { CommandOptions } from "./CommandOptions";
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
  "-f, --format <pretty|whitelist>",
  "The format in which output should be displayed.",
  "pretty",
);

/**
 * The main program entry point.
 */
const main = async (
  command: program.Command,
  logger: Logger,
): Promise<void> => {
  if (!CommandOptions.guard(command)) {
    shell.echo("Invalid options provided.\n");
    program.outputHelp();

    return;
  }

  const [oldSchema, newSchema] = await Promise.all([
    loadSchema(parseFileLocator(command.oldSchema), shell),
    loadSchema(parseFileLocator(command.newSchema), shell),
  ]);

  const breakingChanges = findBreakingChanges(oldSchema, newSchema);
  reportBreakingChanges(breakingChanges, command.format, shell);

  process.exit(breakingChanges.length === 0 ? 0 : 1);
};

const mainLogger = getLogger();
mainLogger.level = process.env.LOG_LEVEL != null ? process.env.LOG_LEVEL : "error";

/**
 * Execute the program.
 */
main(cmd.parse(process.argv), mainLogger).catch((err) => {
  mainLogger.error(`${err}`);
});
