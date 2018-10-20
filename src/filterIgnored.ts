import fs from "fs";
import { BreakingChange } from "graphql";
import { IgnoredChange } from "./IgnoredChange";

/**
 * Filters out ignored changes.
 */
export const filterIgnored = (
  changes: BreakingChange[],
  ignoreFile: string,
  toleranceMs: number,
): BreakingChange[] => {
  if (!fs.existsSync(ignoreFile)) {
    return changes;
  }

  try {
    const now = new Date().getTime();
    const ignore = fs.readFileSync(ignoreFile)
      .toString()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => IgnoredChange.check(JSON.parse(line)));

    return changes.filter((change) => {
      const ignored = ignore.filter(
        (wchange) => wchange.description === change.description && wchange.type === change.type,
      ).sort(
        (wchange) => wchange.timestamp < wchange.timestamp ? -1 : (wchange.timestamp > wchange.timestamp ? 1 : 0),
      );

      if (ignored.length > 0) {
        return ignored[ignored.length - 1].timestamp + toleranceMs < now;
      }

      return true;
    });
  }
  catch (e) {
    throw new Error("Malformed ignore file.");
  }
};
