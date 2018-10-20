"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Formats the given breaking changes in ignore format.
 */
exports.formatIgnore = (changes) => {
    const timestamp = new Date().getTime();
    return changes.map((change) => (JSON.stringify(Object.assign({}, change, { timestamp })))).join("\n");
};
//# sourceMappingURL=formatIgnore.js.map