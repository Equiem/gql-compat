import { Literal, Partial, Record, Static, String, Union } from "runtypes";

/**
 * Runtype representing a parsed command.
 */
export const CommandOptions = Record({
  format: Union(Literal("pretty"), Literal("whitelist")),
  newSchema: String,
  oldSchema: String,
}).And(Partial({
  whitelist: String,
}));

export type CommandOptions = Static<typeof CommandOptions>;
