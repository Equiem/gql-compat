import { Array, Static } from "runtypes";
import { IgnoredChange } from "./IgnoredChange";

/**
 * Runtype for an array of IgnoredChanges.
 */
export const IgnoredChanges = Array(IgnoredChange);

export type IgnoredChanges = Static<typeof IgnoredChanges>;
