import chalk from "chalk";
import { BreakingChange } from "graphql";
import shelljs from "shelljs";
import { formatPretty } from "./formatPretty";

/**
 * Formats the given breaking changes in ignore format.
 */
export const reportBreakingChanges = (changes: BreakingChange[], shell: typeof shelljs): void => {
  if (changes.length === 0) {
    shell.echo(`  ✨  ${chalk.bold.green("The new schema does not introduce any unintentional breaking changes")}`);
  }
  else {
    shell.echo(formatPretty(changes));
  }
};
