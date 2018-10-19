import { Partial, Record, Static, String } from "runtypes";

/**
 * Runtype representing a parsed file locator pattern.
 */
export const FileLocator = Record({
  glob: String,
}).And(Partial({
  committish: String,
}));

export type FileLocator = Static<typeof FileLocator>;
