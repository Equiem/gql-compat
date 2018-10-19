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
const formatWhitelist_1 = require("./formatWhitelist");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let FormatWhitelistSpec = class FormatWhitelistSpec {
    before() {
        this.clock = sinon_1.default.useFakeTimers({ now: new Date() });
    }
    after() {
        this.clock.restore();
    }
    appendTimestamp() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "FIELD_REMOVED", description: "User.name was removed" },
        ];
        const output = formatWhitelist_1.formatWhitelist(changes).split("\n").map((line) => JSON.parse(line));
        chai_1.expect(output[0]).to.deep.eq(Object.assign({}, changes[0], { timestamp: this.clock.Date().getTime() }));
        chai_1.expect(output[1]).to.deep.eq(Object.assign({}, changes[1], { timestamp: this.clock.Date().getTime() }));
    }
};
__decorate([
    mocha_typescript_1.test("append current timestamp to each breaking change"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormatWhitelistSpec.prototype, "appendTimestamp", null);
FormatWhitelistSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], FormatWhitelistSpec);
exports.FormatWhitelistSpec = FormatWhitelistSpec;
//# sourceMappingURL=formatWhitelist.spec.js.map