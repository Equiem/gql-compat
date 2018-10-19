"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
/**
 * Runtype representing a parsed command.
 */
exports.CommandOptions = runtypes_1.Record({
    format: runtypes_1.Union(runtypes_1.Literal("pretty"), runtypes_1.Literal("whitelist")),
    newSchema: runtypes_1.String,
    oldSchema: runtypes_1.String,
}).And(runtypes_1.Partial({
    whitelist: runtypes_1.String,
}));
//# sourceMappingURL=CommandOptions.js.map