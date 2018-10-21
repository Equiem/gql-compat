"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const shelljs_1 = __importDefault(require("shelljs"));
const formatPretty_1 = require("./formatPretty");
/**
 * Formats the given breaking changes in ignore format.
 */
exports.reportBreakingChanges = (changes) => {
    if (changes.length === 0) {
        shelljs_1.default.echo(`  ✨  ${chalk_1.default.bold.green("The new schema does not introduce any unintentional breaking changes")}`);
    }
    else {
        shelljs_1.default.echo(formatPretty_1.formatPretty(changes));
    }
};
//# sourceMappingURL=reportBreakingChanges.js.map