import { Number, Record, Static, String } from "runtypes";

/**
 * Runtype for an array of IgnoredChange.
 */
export const IgnoredChange = Record({
  description: String,
  timestamp: Number,
  type: String,
});

export type IgnoredChange = Static<typeof IgnoredChange>;
