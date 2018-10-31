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
    else if (parts[0] === "npm") {
      const matches = pattern.match(/^npm:(@([^\/]+)\/?)?([^@/]+)(@([^/]+))?\:(.+)$/);

      if (!matches) {
        throw new Error("Invalid npm locator");
      }

      const [, , scope, npmPackage, , version, glob] = matches;

      return {
        glob,
        npmPackage,
        scope,
        version: version != null ? version : "latest",
      };
    }
    else {
      return { committish: parts[0], glob: parts[1] };
    }
  }

  return { glob: parts[0] };
};
