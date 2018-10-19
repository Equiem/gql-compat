"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const formatPretty_1 = require("./formatPretty");
const formatWhitelist_1 = require("./formatWhitelist");
/**
 * Formats the given breaking changes in whitelist format.
 */
exports.reportBreakingChanges = (changes, format, shell) => {
    if (changes.length === 0) {
        if (format === "pretty") {
            shell.echo(`  ✨  ${chalk_1.default.bold.green("The new schema does not introduce any breaking changes")}`);
        }
    }
    else {
        if (format === "whitelist") {
            shell.echo(formatWhitelist_1.formatWhitelist(changes));
        }
        else {
            shell.echo(formatPretty_1.formatPretty(changes));
        }
    }
};
//# sourceMappingURL=reportBreakingChanges.js.map