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
// Must be imported before reportBreakingChanges.
const shelljs_1 = __importDefault(require("./mocks/shelljs"));
const chai_1 = require("chai");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const chalk_1 = __importDefault(require("chalk"));
const mocha_typescript_1 = require("mocha-typescript");
const sinon_1 = __importDefault(require("sinon"));
const testdouble_1 = __importDefault(require("testdouble"));
const formatBreakingChanges_1 = require("./formatBreakingChanges");
const reportBreakingChanges_1 = require("./reportBreakingChanges");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let ReportBreakingChangesSpec = class ReportBreakingChangesSpec {
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
    static after() {
        testdouble_1.default.reset();
    }
    before() {
        this.clock = sinon_1.default.useFakeTimers({ now: new Date() });
    }
    after() {
        this.clock.restore();
        testdouble_1.default.reset();
    }
    prettyNoBreakingChanges() {
        reportBreakingChanges_1.reportBreakingChanges([], []);
        testdouble_1.default.verify(shelljs_1.default.echo(`👍 ${chalk_1.default.bold.green("The new schema does not introduce any unintentional breaking changes")}`));
    }
    prettyBreakingChanges() {
        reportBreakingChanges_1.reportBreakingChanges(this.breakingChanges, []);
        testdouble_1.default.verify(shelljs_1.default.echo(`💥 ${chalk_1.default.bold.red("2 breaking changes were detected")}`));
        testdouble_1.default.verify(shelljs_1.default.echo(formatBreakingChanges_1.formatBreakingChanges(this.breakingChanges)));
    }
    prettyNoBreakingChangesPlusIgnored() {
        const ignored = [
            { type: "FIELD_REMOVED", description: "Product.uuid was removed" },
        ];
        reportBreakingChanges_1.reportBreakingChanges([], ignored);
        testdouble_1.default.verify(shelljs_1.default.echo(`👀 ${chalk_1.default.bold.yellow("1 breaking change was ignored")}`));
        testdouble_1.default.verify(shelljs_1.default.echo(formatBreakingChanges_1.formatBreakingChanges(ignored)));
        testdouble_1.default.verify(shelljs_1.default.echo(`👍 ${chalk_1.default.bold.green("The new schema does not introduce any unintentional breaking changes")}`));
    }
    prettyBreakingChangesPlusIgnored() {
        const ignored = [
            { type: "FIELD_REMOVED", description: "Product.uuid was removed" },
        ];
        reportBreakingChanges_1.reportBreakingChanges(this.breakingChanges, ignored);
        testdouble_1.default.verify(shelljs_1.default.echo(`👀 ${chalk_1.default.bold.yellow("1 breaking change was ignored")}`));
        testdouble_1.default.verify(shelljs_1.default.echo(formatBreakingChanges_1.formatBreakingChanges(ignored)));
        testdouble_1.default.verify(shelljs_1.default.echo(`💥 ${chalk_1.default.bold.red("2 breaking changes were detected")}`));
        testdouble_1.default.verify(shelljs_1.default.echo(formatBreakingChanges_1.formatBreakingChanges(this.breakingChanges)));
    }
};
__decorate([
    mocha_typescript_1.test("report no breaking changes in pretty format"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportBreakingChangesSpec.prototype, "prettyNoBreakingChanges", null);
__decorate([
    mocha_typescript_1.test("report breaking changes in pretty format"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportBreakingChangesSpec.prototype, "prettyBreakingChanges", null);
__decorate([
    mocha_typescript_1.test("report no breaking changes in pretty format as well as ignored"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportBreakingChangesSpec.prototype, "prettyNoBreakingChangesPlusIgnored", null);
__decorate([
    mocha_typescript_1.test("report breaking changes in pretty format as well as ignored"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportBreakingChangesSpec.prototype, "prettyBreakingChangesPlusIgnored", null);
ReportBreakingChangesSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], ReportBreakingChangesSpec);
exports.ReportBreakingChangesSpec = ReportBreakingChangesSpec;
//# sourceMappingURL=reportBreakingChanges.spec.js.map