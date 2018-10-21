#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
const log4js_1 = require("log4js");
const shelljs_1 = __importDefault(require("shelljs"));
const config_1 = require("./config");
const findBreakingChanges_1 = require("./findBreakingChanges");
const ignoreBreakingChanges_1 = require("./ignoreBreakingChanges");
const reportBreakingChanges_1 = require("./reportBreakingChanges");
const mainLogger = log4js_1.getLogger();
mainLogger.level = process.env.LOG_LEVEL != null ? process.env.LOG_LEVEL : "error";
commander_1.default
    .name("gql-compat")
    .version("0.0.1")
    .option("-t, --ignore-tolerance <seconds>", "The length of time for which ignored breakages are ignored.", parseInt, 7 * 24 * 60 * 60);
commander_1.default
    .command("check <old-schema-locator> <new-schema-locator>")
    .action((oldLocator, newLocator, options) => __awaiter(this, void 0, void 0, function* () {
    const breakingChanges = yield findBreakingChanges_1.findBreakingChanges(oldLocator, newLocator, config_1.IGNORE_FILE, options);
    reportBreakingChanges_1.reportBreakingChanges(breakingChanges);
    process.exit(breakingChanges.length === 0 ? 0 : 1);
}));
commander_1.default
    .command("ignore <old-schema-locator> <new-schema-locator>")
    .action((oldLocator, newLocator, options) => __awaiter(this, void 0, void 0, function* () {
    const breakingChanges = yield findBreakingChanges_1.findBreakingChanges(oldLocator, newLocator, config_1.IGNORE_FILE, options);
    ignoreBreakingChanges_1.ignoreBreakingChanges(breakingChanges, config_1.IGNORE_FILE);
}));
commander_1.default.on("command:*", () => {
    shelljs_1.default.echo(`Invalid command: ${commander_1.default.args.join(" ")}\nSee --help for a list of available commands.`);
    process.exit(1);
});
commander_1.default.on("--help", () => {
    shelljs_1.default.echo(`

${chalk_1.default.bold.underline("Locators")}

Locators are a string representing one or more files, either in the current
working directory or in a committish in the currently active git repository.

  glob                  eg. path/to/**/*.graphql
  committish:pattern    eg. origin/master:path/to/*/*.graphql

Note that committish:patterns follow the rules of the git ls-tree command which
is not the same as a glob.`);
});
commander_1.default.parse(process.argv);
//# sourceMappingURL=index.js.map