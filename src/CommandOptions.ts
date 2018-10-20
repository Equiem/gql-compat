import { Number, Record, Static } from "runtypes";

/**
 * Runtype representing a parsed command.
 */
export const CommandOptions = Record({
  ignoreTolerance: Number,
});

export type CommandOptions = Static<typeof CommandOptions>;
