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
const graphql_1 = require("graphql");
const filterIgnored_1 = require("./filterIgnored");
const loadSchema_1 = require("./loadSchema");
const parseFileLocator_1 = require("./parseFileLocator");
/**
 * Find breaking changes, except those ignored in ignoreFile.
 */
exports.findBreakingChanges = (oldSchemaLocator, newSchemaLocator, ignoreFile, options, shell) => __awaiter(this, void 0, void 0, function* () {
    const [oldSchema, newSchema] = yield Promise.all([
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(oldSchemaLocator), shell),
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(newSchemaLocator), shell),
    ]);
    const unfiltered = graphql_1.findBreakingChanges(oldSchema, newSchema);
    const filtered = filterIgnored_1.filterIgnored(unfiltered, ignoreFile, options.ignoreTolerance * 1000);
    if (unfiltered.length > filtered.length) {
        const ignored = unfiltered.length - filtered.length;
        shell.echo(chalk_1.default.yellow(`Ignored ${ignored} breaking change${ignored > 1 ? "s" : ""} in ${ignoreFile}.`));
    }
    return filtered;
});
//# sourceMappingURL=findBreakingChanges.js.map