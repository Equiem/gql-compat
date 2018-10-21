"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const shelljs_1 = __importDefault(require("shelljs"));
const formatBreakingChanges_1 = require("./formatBreakingChanges");
/**
 * Formats the given breaking changes in ignore format.
 */
exports.reportBreakingChanges = (breaking, ignored) => {
    const ignoredLen = ignored.length;
    const breakingLen = breaking.length;
    if (ignoredLen > 0) {
        shelljs_1.default.echo(`👀 ${chalk_1.default.bold.yellow(`${ignoredLen} breaking change${ignoredLen > 1 ? "s were" : " was"} ignored`)}`);
        shelljs_1.default.echo(formatBreakingChanges_1.formatBreakingChanges(ignored));
    }
    if (breakingLen === 0) {
        shelljs_1.default.echo(`👍 ${chalk_1.default.bold.green("The new schema does not introduce any unintentional breaking changes")}`);
    }
    else {
        shelljs_1.default.echo(`💥 ${chalk_1.default.bold.red(`${breakingLen} breaking change${breakingLen > 1 ? "s were" : " was"} detected`)}`);
        shelljs_1.default.echo(formatBreakingChanges_1.formatBreakingChanges(breaking));
    }
};
//# sourceMappingURL=reportBreakingChanges.js.map