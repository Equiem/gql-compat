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
const chai_1 = require("chai");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const chalk_1 = __importDefault(require("chalk"));
const mocha_typescript_1 = require("mocha-typescript");
const mock_fs_1 = __importDefault(require("mock-fs"));
const sinon_1 = __importDefault(require("sinon"));
const testdouble_1 = __importDefault(require("testdouble"));
const config_1 = require("./config");
const findBreakingChanges_1 = require("./findBreakingChanges");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let FindBreakingChangesSpec = class FindBreakingChangesSpec {
    before() {
        this.clock = sinon_1.default.useFakeTimers();
        this.shell = testdouble_1.default.object("shell");
    }
    after() {
        this.clock.restore();
    }
    findBreakingChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            mock_fs_1.default({
                "src/version1": {
                    "product.graphql": "type Product { uuid: String! name: String! }",
                    "user.graphql": "type User { firstname: String! lastname: String! }",
                },
                "src/version2": {
                    "product.graphql": "type Product { name: String! }",
                    "user.graphql": "type User { firstname: Int! lastname: String! }",
                },
            });
            const breakingChanges = yield findBreakingChanges_1.findBreakingChanges("src/version1/*.graphql", "src/version2/*.graphql", ".gql-compat-ignore", { ignoreTolerance: 1000 }, this.shell);
            chai_1.expect(breakingChanges).to.eql([
                {
                    description: "Product.uuid was removed.",
                    type: "FIELD_REMOVED",
                },
                {
                    description: "User.firstname changed type from String! to Int!.",
                    type: "FIELD_CHANGED_KIND",
                },
            ]);
        });
    }
    reporting() {
        return __awaiter(this, void 0, void 0, function* () {
            mock_fs_1.default({
                [config_1.IGNORE_FILE]: '{"description":"Product.uuid was removed.","type":"FIELD_REMOVED","timestamp":0}',
                "src/version1": {
                    "product.graphql": "type Product { uuid: String! name: String! }",
                    "user.graphql": "type User { firstname: String! lastname: String! }",
                },
                "src/version2": {
                    "product.graphql": "type Product { name: String! }",
                    "user.graphql": "type User { firstname: Int! lastname: String! }",
                },
            });
            const breakingChanges = yield findBreakingChanges_1.findBreakingChanges("src/version1/*.graphql", "src/version2/*.graphql", ".gql-compat-ignore", { ignoreTolerance: 1000 }, this.shell);
            chai_1.expect(breakingChanges).to.eql([
                {
                    description: "User.firstname changed type from String! to Int!.",
                    type: "FIELD_CHANGED_KIND",
                },
            ]);
            testdouble_1.default.verify(this.shell.echo(chalk_1.default.yellow("Ignored 1 breaking change in .gql-compat-ignore.")));
        });
    }
};
__decorate([
    mocha_typescript_1.test("find breaking changes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FindBreakingChangesSpec.prototype, "findBreakingChanges", null);
__decorate([
    mocha_typescript_1.test("report ignored changes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FindBreakingChangesSpec.prototype, "reporting", null);
FindBreakingChangesSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], FindBreakingChangesSpec);
exports.FindBreakingChangesSpec = FindBreakingChangesSpec;
//# sourceMappingURL=findBreakingChanges.spec.js.map