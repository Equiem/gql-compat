import chalk from "chalk";
import { BreakingChange } from "graphql";
import shelljs from "shelljs";
import { formatPretty } from "./formatPretty";
import { formatWhitelist } from "./formatWhitelist";

/**
 * Formats the given breaking changes in whitelist format.
 */
export const reportBreakingChanges = (
  changes: BreakingChange[],
  format: "whitelist" | "pretty",
  shell: typeof shelljs,
): void => {
  if (changes.length === 0) {
    if (format === "pretty") {
      shell.echo(`  ✨  ${chalk.bold.green("The new schema does not introduce any breaking changes")}`);
    }
  }
  else {
    if (format === "whitelist") {
      shell.echo(formatWhitelist(changes));
    }
    else {
      shell.echo(formatPretty(changes));
    }
  }
};
