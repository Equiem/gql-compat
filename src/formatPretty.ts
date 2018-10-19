import chalk from "chalk";
import CliTable from "cli-table3";
import { BreakingChange } from "graphql";

/**
 * Formats the given breaking changes in pretty format.
 */
export const formatPretty = (changes: BreakingChange[]): string => {
  const output = `  💩  ${chalk.bold.red("Breaking changes were detected")}`;
  const table = new CliTable({ head: ["Issue", "Description"] });

  // Ignore because of bad type information.
  // @ts-ignore
  table.push(...changes.map((change) => [change.type, change.description]));

  return `${output}

${table.toString()}`;
};
