import { BreakingChange, GraphQLSchema } from "graphql";
import { findBreakingChanges as gqlFindBreakingChanges } from "graphql";
import { CommandOptions } from "./CommandOptions";
import { filterIgnored } from "./filterIgnored";
import { loadSchema } from "./loadSchema";
import { parseFileLocator } from "./parseFileLocator";

/**
 * Find breaking changes, except those ignored in ignoreFile.
 */
export const findBreakingChanges = async (
  oldSchemaLocator: string | GraphQLSchema,
  newSchemaLocator: string | GraphQLSchema,
  ignoreFile?: string,
  options?: CommandOptions,
): Promise<{ breaking: BreakingChange[]; ignored: BreakingChange[]}> => {
  const [oldSchema, newSchema] = await Promise.all([
    oldSchemaLocator instanceof GraphQLSchema ? oldSchemaLocator : loadSchema(parseFileLocator(oldSchemaLocator)),
    newSchemaLocator instanceof GraphQLSchema ? newSchemaLocator : loadSchema(parseFileLocator(newSchemaLocator)),
  ]);

  const all = gqlFindBreakingChanges(oldSchema, newSchema);
  let breaking = all;
  let ignored = [];

  if (ignoreFile != null && options != null && !options.ignored) {
    breaking = filterIgnored(all, ignoreFile, options.ignoreTolerance * 1000);
    ignored = [];
  }

  if (all.length > breaking.length) {
    ignored.push(...all.filter((change) => breaking.indexOf(change) === -1));
  }

  return { breaking, ignored };
};
