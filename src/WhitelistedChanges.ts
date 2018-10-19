import { Array, Static } from "runtypes";
import { WhitelistedChange } from "./WhitelistedChange";

/**
 * Runtype for an array of WhitelistedChanges.
 */
export const WhitelistedChanges = Array(WhitelistedChange);

export type WhitelistedChanges = Static<typeof WhitelistedChanges>;
