"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const formatIgnore_1 = require("./formatIgnore");
/**
 * Writes breaking changes to ignore file.
 */
exports.ignoreBreakingChanges = (changes, ignoreFile, shell) => {
    if (changes.length > 0) {
        fs_1.default.appendFileSync(ignoreFile, `${formatIgnore_1.formatIgnore(changes)}\n`);
        const count = changes.length;
        shell.echo(chalk_1.default.bold.green(`Wrote ${count} breaking change${count > 1 ? "s" : ""} to ${ignoreFile}.`));
    }
    else {
        shell.echo(chalk_1.default.bold.green("No breaking changes to ignore."));
    }
};
//# sourceMappingURL=ignoreBreakingChanges.js.map