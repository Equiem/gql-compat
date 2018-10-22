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
const parseFileLocator_1 = require("./parseFileLocator");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let ParseFileLocatorSpec = class ParseFileLocatorSpec {
    extractCommittishAndGlobPattern() {
        const input = "master:src/**/*.graphql";
        const pattern = parseFileLocator_1.parseFileLocator(input);
        chai_1.expect(pattern).to.eql({
            committish: "master",
            glob: "src/**/*.graphql",
        });
    }
    extractGlobPattern() {
        const input = "src/**/*.graphql";
        const pattern = parseFileLocator_1.parseFileLocator(input);
        chai_1.expect(pattern).to.eql({ glob: "src/**/*.graphql" });
    }
    extractHttpUrl() {
        const input = "http://example.com/graphql";
        const pattern = parseFileLocator_1.parseFileLocator(input);
        chai_1.expect(pattern).to.eql({ url: input });
    }
    extractHttpsUrl() {
        const input = "https://example.com/graphql";
        const pattern = parseFileLocator_1.parseFileLocator(input);
        chai_1.expect(pattern).to.eql({ url: input });
    }
};
__decorate([
    mocha_typescript_1.test("extract a committish and glob pattern"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseFileLocatorSpec.prototype, "extractCommittishAndGlobPattern", null);
__decorate([
    mocha_typescript_1.test("extract a glob pattern only"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseFileLocatorSpec.prototype, "extractGlobPattern", null);
__decorate([
    mocha_typescript_1.test("extract an http url"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseFileLocatorSpec.prototype, "extractHttpUrl", null);
__decorate([
    mocha_typescript_1.test("extract an https url"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParseFileLocatorSpec.prototype, "extractHttpsUrl", null);
ParseFileLocatorSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], ParseFileLocatorSpec);
exports.ParseFileLocatorSpec = ParseFileLocatorSpec;
//# sourceMappingURL=parseFileLocator.spec.js.map