"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const mocha_typescript_1 = require("mocha-typescript");
const sinon_1 = __importDefault(require("sinon"));
const formatPretty_1 = require("./formatPretty");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let FormatPrettySpec = class FormatPrettySpec {
    before() {
        this.clock = sinon_1.default.useFakeTimers({ now: new Date() });
    }
    prettyFormat() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "TYPE_REMOVED", description: "User was removed" },
        ];
        const output = formatPretty_1.formatPretty(changes);
        chai_1.expect(output).to.include("Breaking changes were detected");
        chai_1.expect(output).to.include("FIELD_REMOVED");
        chai_1.expect(output).to.include("User.uuid was removed");
        chai_1.expect(output).to.include("TYPE_REMOVED");
        chai_1.expect(output).to.include("User was removed");
    }
};
__decorate([
    mocha_typescript_1.test("pretty format breaking changes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormatPrettySpec.prototype, "prettyFormat", null);
FormatPrettySpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], FormatPrettySpec);
exports.FormatPrettySpec = FormatPrettySpec;
//# sourceMappingURL=formatPretty.spec.js.map