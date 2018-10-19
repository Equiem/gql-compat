import fs from "fs";
import { BreakingChange } from "graphql";
import { WhitelistedChange } from "./WhitelistedChange";

/**
 * Formats the given breaking changes in pretty format.
 */
export const filterWhitelisted = (
  changes: BreakingChange[],
  whitelistFile: string,
  toleranceMs: number,
): BreakingChange[] => {
  const now = new Date().getTime();

  try {
    const whitelist = fs.readFileSync(whitelistFile)
        .toString()
        .split("\n")
        .map((line) => WhitelistedChange.check(JSON.parse(line)));

    return changes.filter((change) => {
      const whitelisted = whitelist.filter(
        (wchange) => wchange.description === change.description && wchange.type === change.type,
      ).sort(
        (wchange) => wchange.timestamp < wchange.timestamp ? -1 : (wchange.timestamp > wchange.timestamp ? 1 : 0),
      );

      if (whitelisted.length > 0) {
        return whitelisted[whitelisted.length - 1].timestamp + toleranceMs < now;
      }

      return true;
    });
  }
  catch (e) {
    throw new Error("Malformed whitelist file.");
  }
};
