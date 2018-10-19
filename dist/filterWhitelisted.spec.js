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
const filterWhitelisted_1 = require("./filterWhitelisted");
const formatWhitelist_1 = require("./formatWhitelist");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let FilterWhitelistedSpec = class FilterWhitelistedSpec {
    before() {
        this.clock = sinon_1.default.useFakeTimers({ now: new Date() });
    }
    after() {
        this.clock.restore();
    }
    filterRecentWhitelisted() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "TYPE_REMOVED", description: "User was removed" },
        ];
        const whitelist = formatWhitelist_1.formatWhitelist(changes.slice(0, 1));
        mock_fs_1.default({ "path/to/graphql-whitelist.json": whitelist });
        // Advance time exactly by threshold.
        const tolerance = 1000;
        this.clock.tick(tolerance);
        const filtered = filterWhitelisted_1.filterWhitelisted(changes, "path/to/graphql-whitelist.json", tolerance);
        chai_1.expect(filtered.length).to.eq(1);
        chai_1.expect(filtered[0]).to.deep.eq(changes[1]);
    }
    dontFilterOldWhitelisted() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "TYPE_REMOVED", description: "User was removed" },
        ];
        const whitelist = formatWhitelist_1.formatWhitelist(changes.slice(0, 1));
        mock_fs_1.default({ "path/to/graphql-whitelist.json": whitelist });
        // Advance time by 1 ms more than threshold.
        const tolerance = 1000;
        this.clock.tick(tolerance + 1);
        const filtered = filterWhitelisted_1.filterWhitelisted(changes, "path/to/graphql-whitelist.json", tolerance);
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
        const whitelistOld = formatWhitelist_1.formatWhitelist(changes.slice(0, 1));
        // Advance time by 1ms more than threshold.
        this.clock.tick(tolerance + 1);
        const whitelistCurrent = formatWhitelist_1.formatWhitelist(changes.slice(0, 1));
        mock_fs_1.default({ "path/to/graphql-whitelist.json": `${whitelistOld}\n${whitelistCurrent}` });
        const filtered = filterWhitelisted_1.filterWhitelisted(changes, "path/to/graphql-whitelist.json", tolerance);
        chai_1.expect(filtered.length).to.eq(1);
        chai_1.expect(filtered[0]).to.deep.eq(changes[1]);
    }
    malformedWhitelistFile() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
        ];
        mock_fs_1.default({ "path/to/graphql-whitelist.json": '{ "format: "invalid" }' });
        chai_1.expect(() => filterWhitelisted_1.filterWhitelisted(changes, "path/to/graphql-whitelist.json", 1000)).to.throw("Malformed whitelist file");
    }
    malformedJsonWhitelistFile() {
        const changes = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
        ];
        mock_fs_1.default({ "path/to/graphql-whitelist.json": "Malformed data" });
        chai_1.expect(() => filterWhitelisted_1.filterWhitelisted(changes, "path/to/graphql-whitelist.json", 1000)).to.throw("Malformed whitelist file");
    }
};
__decorate([
    mocha_typescript_1.test("filter out whitelisted breakages within tolerance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterWhitelistedSpec.prototype, "filterRecentWhitelisted", null);
__decorate([
    mocha_typescript_1.test("don't filter out whitelisted breakages past tolerance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterWhitelistedSpec.prototype, "dontFilterOldWhitelisted", null);
__decorate([
    mocha_typescript_1.test("handle mixture of whitelisted past and not passed tolerance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterWhitelistedSpec.prototype, "mixtedTimstamps", null);
__decorate([
    mocha_typescript_1.test("error on malformed whitelist file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterWhitelistedSpec.prototype, "malformedWhitelistFile", null);
__decorate([
    mocha_typescript_1.test("error on malformed JSON in whitelist file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilterWhitelistedSpec.prototype, "malformedJsonWhitelistFile", null);
FilterWhitelistedSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], FilterWhitelistedSpec);
exports.FilterWhitelistedSpec = FilterWhitelistedSpec;
//# sourceMappingURL=filterWhitelisted.spec.js.map