"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Provide a test double for the shelljs module.
const testdouble_1 = __importDefault(require("testdouble"));
const shell = testdouble_1.default.replace("shelljs");
module.exports = shell;
//# sourceMappingURL=shelljs.js.map