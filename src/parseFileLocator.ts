import { FileLocator } from "./FileLocator";

/**
 * Parses a file locator string pattern.
 */
export const parseFileLocator = (pattern: string): FileLocator => {
  const parts = pattern.trim().split(":");

  if (parts[1] != null) {
    return { committish: parts[0], glob: parts[1] };
  }

  return { glob: parts[0] };
};
