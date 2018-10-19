import { Number, Record, Static, String } from "runtypes";

/**
 * Runtype for an array of WhitelistedChange.
 */
export const WhitelistedChange = Record({
  description: String,
  timestamp: Number,
  type: String,
});

export type WhitelistedChange = Static<typeof WhitelistedChange>;
