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
const commander_1 = __importDefault(require("commander"));
const graphql_1 = require("graphql");
const log4js_1 = require("log4js");
const shelljs_1 = __importDefault(require("shelljs"));
const CommandOptions_1 = require("./CommandOptions");
const loadSchema_1 = require("./loadSchema");
const parseFileLocator_1 = require("./parseFileLocator");
const reportBreakingChanges_1 = require("./reportBreakingChanges");
const cmd = commander_1.default
    .name("gql-compat")
    .version("0.0.1")
    .option("-o, --old-schema <[committish:]glob-pattern>", "A glob pattern matching one or more IDL schema files in the given committish "
    + "in the current repository. If the committish prefix is ommitted the current working copy is used.")
    .option("-n, --new-schema <[committish:]glob-pattern>", "A glob pattern matching one or more IDL schema files in the given committish "
    + "in the current repository. If the committish prefix is ommitted the current working copy is used.")
    .option("-w, --whitelist <path/to/file>", "The path to a whitelist file, which lists incompatibilities that should be ignored. "
    + "You can create this file using the 'whitelist' output format.")
    .option("-f, --format <pretty|whitelist>", "The format in which output should be displayed.", "pretty");
/**
 * The main program entry point.
 */
const main = (command, logger) => __awaiter(this, void 0, void 0, function* () {
    if (!CommandOptions_1.CommandOptions.guard(command)) {
        shelljs_1.default.echo("Invalid options provided.\n");
        commander_1.default.outputHelp();
        return;
    }
    const [oldSchema, newSchema] = yield Promise.all([
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(command.oldSchema), shelljs_1.default),
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(command.newSchema), shelljs_1.default),
    ]);
    const breakingChanges = graphql_1.findBreakingChanges(oldSchema, newSchema);
    reportBreakingChanges_1.reportBreakingChanges(breakingChanges, command.format, shelljs_1.default);
    process.exit(breakingChanges.length === 0 ? 0 : 1);
});
const mainLogger = log4js_1.getLogger();
mainLogger.level = process.env.LOG_LEVEL != null ? process.env.LOG_LEVEL : "error";
/**
 * Execute the program.
 */
main(cmd.parse(process.argv), mainLogger).catch((err) => {
    mainLogger.error(`${err}`);
});
//# sourceMappingURL=index.js.map