"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const IgnoredChange_1 = require("./IgnoredChange");
/**
 * Filters out ignored changes.
 */
exports.filterIgnored = (changes, ignoreFile, toleranceMs) => {
    if (!fs_1.default.existsSync(ignoreFile)) {
        return changes;
    }
    try {
        const now = new Date().getTime();
        const ignore = fs_1.default.readFileSync(ignoreFile)
            .toString()
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => IgnoredChange_1.IgnoredChange.check(JSON.parse(line)));
        return changes.filter((change) => {
            const ignored = ignore.filter((wchange) => wchange.description === change.description && wchange.type === change.type).sort((wchange) => wchange.timestamp < wchange.timestamp ? -1 : (wchange.timestamp > wchange.timestamp ? 1 : 0));
            if (ignored.length > 0) {
                return ignored[ignored.length - 1].timestamp + toleranceMs < now;
            }
            return true;
        });
    }
    catch (e) {
        throw new Error("Malformed ignore file.");
    }
};
//# sourceMappingURL=filterIgnored.js.map