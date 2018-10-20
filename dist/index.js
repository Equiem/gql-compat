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
const graphql_1 = require("graphql");
const log4js_1 = require("log4js");
const shelljs_1 = __importDefault(require("shelljs"));
const CommandOptions_1 = require("./CommandOptions");
const filterWhitelisted_1 = require("./filterWhitelisted");
const loadSchema_1 = require("./loadSchema");
const parseFileLocator_1 = require("./parseFileLocator");
const reportBreakingChanges_1 = require("./reportBreakingChanges");
const cmd = commander_1.default
    .name("gql-compat")
    .version("0.0.1")
    .option("-o, --old-schema <locator>", "The location of one or more IDL schema files.")
    .option("-n, --new-schema <locator>", "The location of one or more IDL schema files.")
    .option("-w, --whitelist <path/to/file>", "The path to a whitelist file, listing incompatibilities to be ignored.")
    .option("-t, --whitelist-tolerance <seconds>", "The length of time for which whitelisted breakages are ignored.", parseInt, 7 * 24 * 60 * 60)
    .option("-f, --format <pretty|whitelist>", "The output format. Use 'whitelist' to generate contents of a whitelist file.", "pretty");
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
/**
 * The main program entry point.
 */
const main = (command) => __awaiter(this, void 0, void 0, function* () {
    if (!CommandOptions_1.CommandOptions.guard(command)) {
        shelljs_1.default.echo("Invalid options provided.\n");
        commander_1.default.outputHelp();
        return;
    }
    const [oldSchema, newSchema] = yield Promise.all([
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(command.oldSchema), shelljs_1.default),
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(command.newSchema), shelljs_1.default),
    ]);
    let breakingChanges = graphql_1.findBreakingChanges(oldSchema, newSchema);
    if (command.whitelist != null) {
        breakingChanges = filterWhitelisted_1.filterWhitelisted(breakingChanges, command.whitelist, command.whitelistTolerance * 1000);
    }
    reportBreakingChanges_1.reportBreakingChanges(breakingChanges, command.format, shelljs_1.default);
    process.exit(breakingChanges.length === 0 ? 0 : 1);
});
const mainLogger = log4js_1.getLogger();
mainLogger.level = process.env.LOG_LEVEL != null ? process.env.LOG_LEVEL : "error";
/**
 * Execute the program.
 */
main(cmd.parse(process.argv)).catch((err) => {
    mainLogger.error(`${err}`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map