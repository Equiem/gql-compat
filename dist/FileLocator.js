"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
/**
 * Runtype representing a parsed file locator pattern.
 */
exports.FileLocator = runtypes_1.Record({
    glob: runtypes_1.String,
}).And(runtypes_1.Partial({
    committish: runtypes_1.String,
}));
//# sourceMappingURL=FileLocator.js.map