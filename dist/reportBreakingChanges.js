"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const formatPretty_1 = require("./formatPretty");
/**
 * Formats the given breaking changes in ignore format.
 */
exports.reportBreakingChanges = (changes, shell) => {
    if (changes.length === 0) {
        shell.echo(`  ✨  ${chalk_1.default.bold.green("The new schema does not introduce any unintentional breaking changes")}`);
    }
    else {
        shell.echo(formatPretty_1.formatPretty(changes));
    }
};
//# sourceMappingURL=reportBreakingChanges.js.map