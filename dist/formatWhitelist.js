"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Formats the given breaking changes in whitelist format.
 */
exports.formatWhitelist = (changes) => {
    const timestamp = new Date().getTime();
    return changes.map((change) => (JSON.stringify(Object.assign({}, change, { timestamp })))).join("\n");
};
//# sourceMappingURL=formatWhitelist.js.map