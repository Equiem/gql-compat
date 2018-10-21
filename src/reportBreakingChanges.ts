import chalk from "chalk";
import { BreakingChange } from "graphql";
import shell from "shelljs";
import { formatBreakingChanges } from "./formatBreakingChanges";

/**
 * Formats the given breaking changes in ignore format.
 */
export const reportBreakingChanges = (breaking: BreakingChange[], ignored: BreakingChange[]): void => {
  const ignoredLen = ignored.length;
  const breakingLen = breaking.length;

  if (ignoredLen > 0) {
    shell.echo(`👀 ${chalk.bold.yellow(`${ignoredLen} breaking change${ignoredLen > 1 ? "s were" : " was"} ignored`)}`);
    shell.echo(formatBreakingChanges(ignored));
  }

  if (breakingLen === 0) {
    shell.echo(`👍 ${chalk.bold.green("The new schema does not introduce any unintentional breaking changes")}`);
  }
  else {
    shell.echo(`💥 ${chalk.bold.red(`${breakingLen} breaking change${breakingLen > 1 ? "s were" : " was"} detected`)}`);
    shell.echo(formatBreakingChanges(breaking));
  }
};
