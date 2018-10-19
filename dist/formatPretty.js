"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const cli_table3_1 = __importDefault(require("cli-table3"));
/**
 * Formats the given breaking changes in pretty format.
 */
exports.formatPretty = (changes) => {
    const output = `  💩  ${chalk_1.default.bold.red("Breaking changes were detected")}`;
    const table = new cli_table3_1.default({ head: ["Issue", "Description"] });
    // Ignore because of bad type information.
    // @ts-ignore
    table.push(...changes.map((change) => [change.type, change.description]));
    return `${output}

${table.toString()}`;
};
//# sourceMappingURL=formatPretty.js.map