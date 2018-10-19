import { BreakingChange } from "graphql";

/**
 * Formats the given breaking changes in whitelist format.
 */
export const formatWhitelist = (changes: BreakingChange[]): string => {
  const timestamp = new Date().getTime();

  return changes.map((change) => (JSON.stringify({ ...change, timestamp }))).join("\n");
};
