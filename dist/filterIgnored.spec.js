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
const mock_fs_1 = __importDefault(require("mock-fs"));
const sinon_1 = __importDefault(require("sinon"));
const filterIgnored_1 = require("./filterIgnored");
const formatIgnore_1 = require("./formatIgnore");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let FilterIgnoredSpec = class FilterIgnoredSpec {
    before() {
        this.clock = sinon_1.default.useFakeTimers({ now: new Date() });
    }
    after() {
        this.clock.restore();
    }
    missingIgnoreFile() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "TYPE_REMOVED", description: "User was removed" },
        ];
        mock_fs_1.default();
        const filtered = filterIgnored_1.filterIgnored(changes, "path/to/graphql-ignore.json", 1000);
        chai_1.expect(filtered.length).to.eq(2);
        chai_1.expect(filtered[0]).to.deep.eq(changes[0]);
        chai_1.expect(filtered[1]).to.deep.eq(changes[1]);
    }
    filterRecentIgnored() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "TYPE_REMOVED", description: "User was removed" },
        ];
        const ignore = formatIgnore_1.formatIgnore(changes.slice(0, 1));
        mock_fs_1.default({ "path/to/graphql-ignore.json": ignore });
        // Advance time exactly by threshold.
        const tolerance = 1000;
        this.clock.tick(tolerance);
        const filtered = filterIgnored_1.filterIgnored(changes, "path/to/graphql-ignore.json", tolerance);
        chai_1.expect(filtered.length).to.eq(1);
        chai_1.expect(filtered[0]).to.deep.eq(changes[1]);
    }
    dontFilterOldIgnored() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "TYPE_REMOVED", description: "User was removed" },
        ];
        const ignore = formatIgnore_1.formatIgnore(changes.slice(0, 1));
        mock_fs_1.default({ "path/to/graphql-ignore.json": ignore });
        // Advance time by 1 ms more than threshold.
        const tolerance = 1000;
        this.clock.tick(tolerance + 1);
        const filtered = filterIgnored_1.filterIgnored(changes, "path/to/graphql-ignore.json", tolerance);
        chai_1.expect(filtered.length).to.eq(2);
        chai_1.expect(filtered[0]).to.deep.eq(changes[0]);
        chai_1.expect(filtered[1]).to.deep.eq(changes[1]);
    }
    mixtedTimstamps() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "TYPE_REMOVED", description: "User was removed" },
        ];
        const tolerance = 1000;
        const ignoreOld = formatIgnore_1.formatIgnore(changes.slice(0, 1));
        // Advance time by 1ms more than threshold.
        this.clock.tick(tolerance + 1);
        const ignoreCurrent = formatIgnore_1.formatIgnore(changes.slice(0, 1));
        mock_fs_1.default({ "path/to/graphql-ignore.json": `${ignoreOld}\n${ignoreCurrent}` });
        const filtered = filterIgnored_1.filterIgnored(changes, "path/to/graphql-ignore.json", tolerance);
        chai_1.expect(filtered.length).to.eq(1);
        chai_1.expect(filtered[0]).to.deep.eq(changes[1]);
    }
    malformedIgnoreFile() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
        ];
        mock_fs_1.default({ "path/to/graphql-ignore.json": '{ "format: "invalid" }' });
        chai_1.expect(() => filterIgnored_1.filterIgnored(changes, "path/to/graphql-ignore.json", 1000)).to.throw("Malformed ignore file");
    }
    malformedJsonIgnoreFile() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
        ];
        mock_fs_1.default({ "path/to/graphql-ignore.json": "Malformed data" });
        chai_1.expect(() => filterIgnored_1.filterIgnored(changes, "path/to/graphql-ignore.json", 1000)).to.throw("Malformed ignore file");
    }
};
__decorate([
    mocha_typescript_1.test("don't filter if ignore file missing"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterIgnoredSpec.prototype, "missingIgnoreFile", null);
__decorate([
    mocha_typescript_1.test("filter out ignored breakages within tolerance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterIgnoredSpec.prototype, "filterRecentIgnored", null);
__decorate([
    mocha_typescript_1.test("don't filter out ignored breakages past tolerance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterIgnoredSpec.prototype, "dontFilterOldIgnored", null);
__decorate([
    mocha_typescript_1.test("handle mixture of ignored past and not passed tolerance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterIgnoredSpec.prototype, "mixtedTimstamps", null);
__decorate([
    mocha_typescript_1.test("error on malformed ignore file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterIgnoredSpec.prototype, "malformedIgnoreFile", null);
__decorate([
    mocha_typescript_1.test("error on malformed JSON in ignore file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterIgnoredSpec.prototype, "malformedJsonIgnoreFile", null);
FilterIgnoredSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], FilterIgnoredSpec);
exports.FilterIgnoredSpec = FilterIgnoredSpec;
//# sourceMappingURL=filterIgnored.spec.js.map