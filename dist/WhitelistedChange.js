"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
/**
 * Runtype for an array of WhitelistedChange.
 */
exports.WhitelistedChange = runtypes_1.Record({
    description: runtypes_1.String,
    timestamp: runtypes_1.Number,
    type: runtypes_1.String,
});
//# sourceMappingURL=WhitelistedChange.js.map