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
// Must be imported before fs.
const mock_fs_1 = __importDefault(require("mock-fs"));
const chai_1 = require("chai");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const mocha_typescript_1 = require("mocha-typescript");
const sinon_1 = __importDefault(require("sinon"));
const testdouble_1 = __importDefault(require("testdouble"));
const formatIgnore_1 = require("./formatIgnore");
const ignoreBreakingChanges_1 = require("./ignoreBreakingChanges");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let IgnoreBreakingChangesSpec = class IgnoreBreakingChangesSpec {
    // tslint:disable:no-unsafe-any
    // tslint:disable:no-unused-expression
    /**
     * Tests for the Environment.
     */
    constructor() {
        this.breakingChanges = [
            { type: "FIELD_REMOVED", description: "User.uuid was removed" },
            { type: "FIELD_REMOVED", description: "User.name was removed" },
        ];
    }
    before() {
        this.clock = sinon_1.default.useFakeTimers(new Date());
        this.shell = testdouble_1.default.object("shell");
    }
    after() {
        this.clock.restore();
    }
    dontCreateEmptyFile() {
        const ignoreFile = ".gql-compat-ignore";
        mock_fs_1.default();
        ignoreBreakingChanges_1.ignoreBreakingChanges([], ignoreFile, this.shell);
        chai_1.expect(fs_1.default.existsSync(ignoreFile), "Ignore file should NOT exist").to.be.false;
        testdouble_1.default.verify(this.shell.echo(chalk_1.default.bold.green("No breaking changes to ignore.")));
    }
    createIgnoreFile() {
        const ignoreFile = ".gql-compat-ignore";
        mock_fs_1.default();
        ignoreBreakingChanges_1.ignoreBreakingChanges(this.breakingChanges, ignoreFile, this.shell);
        chai_1.expect(fs_1.default.existsSync(ignoreFile), "Ignore file should exist").to.be.true;
        chai_1.expect(fs_1.default.readFileSync(ignoreFile).toString()).to.eq(`${formatIgnore_1.formatIgnore(this.breakingChanges)}\n`);
        testdouble_1.default.verify(this.shell.echo(chalk_1.default.bold.green(`Wrote 2 breaking changes to ${ignoreFile}.`)));
    }
    appendToIgnoreFile() {
        const ignoreFile = ".gql-compat-ignore";
        mock_fs_1.default();
        ignoreBreakingChanges_1.ignoreBreakingChanges(this.breakingChanges.slice(0, 1), ignoreFile, this.shell);
        ignoreBreakingChanges_1.ignoreBreakingChanges(this.breakingChanges.slice(1, 2), ignoreFile, this.shell);
        chai_1.expect(fs_1.default.existsSync(ignoreFile), "Ignore file should exist").to.be.true;
        chai_1.expect(fs_1.default.readFileSync(ignoreFile).toString()).to.eq(`${formatIgnore_1.formatIgnore(this.breakingChanges)}\n`);
        testdouble_1.default.verify(this.shell.echo(chalk_1.default.bold.green(`Wrote 1 breaking change to ${ignoreFile}.`)), { times: 2 });
    }
};
__decorate([
    mocha_typescript_1.test("don't create an empty ignore file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IgnoreBreakingChangesSpec.prototype, "dontCreateEmptyFile", null);
__decorate([
    mocha_typescript_1.test("write breaking changes to newly created ignore file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IgnoreBreakingChangesSpec.prototype, "createIgnoreFile", null);
__decorate([
    mocha_typescript_1.test("append breaking changes to new line in existing ignore file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IgnoreBreakingChangesSpec.prototype, "appendToIgnoreFile", null);
IgnoreBreakingChangesSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], IgnoreBreakingChangesSpec);
exports.IgnoreBreakingChangesSpec = IgnoreBreakingChangesSpec;
//# sourceMappingURL=ignoreBreakingChanges.spec.js.map