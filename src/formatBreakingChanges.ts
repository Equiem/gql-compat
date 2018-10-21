import CliTable from "cli-table3";
import { BreakingChange } from "graphql";

/**
 * Formats the given breaking changes in pretty format.
 */
export const formatBreakingChanges = (changes: BreakingChange[]): string => {
  const table = new CliTable();

  // Ignore because of bad type information.
  // @ts-ignore
  table.push(...changes.map((change) => [change.type, change.description]));

  return table.toString();
};
