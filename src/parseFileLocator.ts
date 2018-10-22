import { FileLocator } from "./FileLocator";

/**
 * Parses a file locator string pattern.
 */
export const parseFileLocator = (pattern: string): FileLocator => {
  const parts = pattern.trim().split(":");

  if (parts[1] != null) {
    if (parts[0] === "http" || parts[0] === "https") {
      return { url: parts.join(":") };
    }
    else {
      return { committish: parts[0], glob: parts[1] };
    }
  }

  return { glob: parts[0] };
};
