import { BreakingChange } from "graphql";
import { findBreakingChanges as gqlFindBreakingChanges } from "graphql";
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
): Promise<{ breaking: BreakingChange[]; ignored: BreakingChange[]}> => {
  const [oldSchema, newSchema] = await Promise.all([
    loadSchema(parseFileLocator(oldSchemaLocator)),
    loadSchema(parseFileLocator(newSchemaLocator)),
  ]);

  const all = gqlFindBreakingChanges(oldSchema, newSchema);
  const breaking = filterIgnored(all, ignoreFile, options.ignoreTolerance * 1000);
  const ignored = [];

  if (all.length > breaking.length) {
    ignored.push(...all.filter((change) => breaking.indexOf(change) === -1));
  }

  return { breaking, ignored };
};
