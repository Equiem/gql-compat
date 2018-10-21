"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const filterIgnored_1 = require("./filterIgnored");
const loadSchema_1 = require("./loadSchema");
const parseFileLocator_1 = require("./parseFileLocator");
/**
 * Find breaking changes, except those ignored in ignoreFile.
 */
exports.findBreakingChanges = (oldSchemaLocator, newSchemaLocator, ignoreFile, options) => __awaiter(this, void 0, void 0, function* () {
    const [oldSchema, newSchema] = yield Promise.all([
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(oldSchemaLocator)),
        loadSchema_1.loadSchema(parseFileLocator_1.parseFileLocator(newSchemaLocator)),
    ]);
    const all = graphql_1.findBreakingChanges(oldSchema, newSchema);
    const breaking = filterIgnored_1.filterIgnored(all, ignoreFile, options.ignoreTolerance * 1000);
    const ignored = [];
    if (all.length > breaking.length) {
        ignored.push(...all.filter((change) => breaking.indexOf(change) === -1));
    }
    return { breaking, ignored };
});
//# sourceMappingURL=findBreakingChanges.js.map