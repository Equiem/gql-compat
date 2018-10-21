import chalk from "chalk";
import fs from "fs";
import { BreakingChange } from "graphql";
import shell from "shelljs";
import { formatIgnore } from "./formatIgnore";

/**
 * Writes breaking changes to ignore file.
 */
export const ignoreBreakingChanges = (
  changes: BreakingChange[],
  ignoreFile: string,
): void => {
  if (changes.length > 0) {
    fs.appendFileSync(ignoreFile, `${formatIgnore(changes)}\n`);
    const count = changes.length;
    shell.echo(chalk.bold.green(
      `Wrote ${count} breaking change${count > 1 ? "s" : ""} to ${ignoreFile}.`,
    ));
  }
  else {
    shell.echo(chalk.bold.green("No breaking changes to ignore."));
  }
};
