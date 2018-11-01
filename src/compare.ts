import { printSchema } from "graphql";
import { CompareResult } from "./CompareResult";
import { findBreakingChanges } from "./findBreakingChanges";
import { loadSchema } from "./loadSchema";
import { parseFileLocator } from "./parseFileLocator";

/**
 * Detect whether there are any changes between 2 schemas.
 */
export const compare = async (oldLocator: string, newLocator: string): Promise<CompareResult> => {
  const [oldSchema, newSchema] = await Promise.all([
    loadSchema(parseFileLocator(oldLocator)),
    loadSchema(parseFileLocator(newLocator)),
  ]);

  const oldIDL = printSchema(oldSchema);
  const newIDL = printSchema(newSchema);

  if (oldIDL === newIDL) {
    return "no-change";
  }
  else {
    const breakingChanges = await findBreakingChanges(oldSchema, newSchema);

    return breakingChanges.breaking.length > 0 ? "incompatible-change" : "compatible-change";
  }
};
