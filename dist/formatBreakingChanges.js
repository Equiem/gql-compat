"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_table3_1 = __importDefault(require("cli-table3"));
/**
 * Formats the given breaking changes in pretty format.
 */
exports.formatBreakingChanges = (changes) => {
    const table = new cli_table3_1.default();
    // Ignore because of bad type information.
    // @ts-ignore
    table.push(...changes.map((change) => [change.type, change.description]));
    return table.toString();
};
//# sourceMappingURL=formatBreakingChanges.js.map