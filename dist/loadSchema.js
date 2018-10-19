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
const fs_1 = __importDefault(require("fs"));
const glob_promise_1 = __importDefault(require("glob-promise"));
const graphql_1 = require("graphql");
const shelljs_1 = __importDefault(require("shelljs"));
/**
 * Parses a file locator string pattern.
 */
exports.loadSchema = (locator, shell) => __awaiter(this, void 0, void 0, function* () {
    if (locator.committish == null) {
        const files = yield glob_promise_1.default(locator.glob);
        const data = files.map((name) => fs_1.default.readFileSync(name)).join("\n\n");
        return graphql_1.buildSchema(data);
    }
    else {
        const sh = shell != null ? shell : shelljs_1.default;
        const committish = locator.committish;
        const glob = locator.glob;
        if (!sh.which("git")) {
            throw new Error("Sorry, this script requires git");
        }
        const result = sh.exec(`for file in $(git ls-tree ${committish} -r --name-only ${glob}); `
            + `do git show ${committish}:$file; echo '';`
            + "done;", { silent: true });
        if (result.code !== 0) {
            throw new Error(result.stderr);
        }
        return graphql_1.buildSchema(result.stdout);
    }
});
//# sourceMappingURL=loadSchema.js.map