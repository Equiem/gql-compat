import { Boolean, Number, Record, Static } from "runtypes";

/**
 * Runtype representing a parsed command.
 */
export const CommandOptions = Record({
  ignoreTolerance: Number,
  ignored: Boolean,
});

export type CommandOptions = Static<typeof CommandOptions>;
