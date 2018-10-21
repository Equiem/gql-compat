import chalk from "chalk";
import { BreakingChange } from "graphql";
import { findBreakingChanges as gqlFindBreakingChanges } from "graphql";
import shell from "shelljs";
import { CommandOptions } from "./CommandOptions";
import { filterIgnored } from "./filterIgnored";
import { loadSchema } from "./loadSchema";
import { parseFileLocator } from "./parseFileLocator";

/**
 * Find breaking changes, except those ignored in ignoreFile.
 */
export const findBreakingChanges = async (
  oldSchemaLocator: string,
  newSchemaLocator: string,
  ignoreFile: string,
  options: CommandOptions,
): Promise<BreakingChange[]> => {
  const [oldSchema, newSchema] = await Promise.all([
    loadSchema(parseFileLocator(oldSchemaLocator)),
    loadSchema(parseFileLocator(newSchemaLocator)),
  ]);

  const unfiltered = gqlFindBreakingChanges(oldSchema, newSchema);
  const filtered = filterIgnored(unfiltered, ignoreFile, options.ignoreTolerance * 1000);

  if (unfiltered.length > filtered.length) {
    const ignored = unfiltered.length - filtered.length;
    shell.echo(chalk.yellow(`Ignored ${ignored} breaking change${ignored > 1 ? "s" : ""} in ${ignoreFile}.`));
  }

  return filtered;
};
