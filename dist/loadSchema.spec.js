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
const mocha_typescript_1 = require("mocha-typescript");
const mock_fs_1 = __importDefault(require("mock-fs"));
const testdouble_1 = __importDefault(require("testdouble"));
const loadSchema_1 = require("./loadSchema");
chai_1.use(chai_as_promised_1.default);
// tslint:disable:no-unsafe-any
// tslint:disable:no-unused-expression
/**
 * Tests for the Environment.
 */
let LoadSchemaSpec = class LoadSchemaSpec {
    after() {
        mock_fs_1.default.restore();
    }
    loadGlobPattern() {
        return __awaiter(this, void 0, void 0, function* () {
            mock_fs_1.default({
                "src/path": {
                    "product.graphql": "type Product { uuid: String! name: String! }",
                    "user.graphql": "type User { firstname: String! lastname: String! }",
                },
            });
            const schema = yield loadSchema_1.loadSchema({ glob: "src/**/*.graphql" });
            const user = schema.getType("User");
            const product = schema.getType("Product");
            chai_1.expect(user).not.to.be.undefined;
            chai_1.expect(product).not.to.be.undefined;
        });
    }
    checkForGit() {
        return __awaiter(this, void 0, void 0, function* () {
            const shell = testdouble_1.default.object("shell");
            const committish = "master";
            const glob = "src/**/*.graphql";
            testdouble_1.default.when(shell.which("git")).thenReturn(false);
            chai_1.expect(loadSchema_1.loadSchema({ committish, glob }, shell)).to.eventually.be.rejectedWith("Sorry, this script requires git");
        });
    }
    loadCommittishGlobPattern() {
        return __awaiter(this, void 0, void 0, function* () {
            const shell = testdouble_1.default.object("shell");
            const committish = "master";
            const glob = "src/**/*.graphql";
            testdouble_1.default.when(shell.which("git")).thenReturn(true);
            testdouble_1.default.when(shell.exec(`for file in $(git ls-tree ${committish} -r --name-only ${glob}); `
                + `do git show ${committish}:$file; echo '';`
                + "done;", { silent: true }))
                .thenReturn({
                code: 0,
                stderr: "",
                stdout: `type Product { uuid: String! name: String! }

      type User { firstname: String! lastname: String! }
      `,
            });
            const schema = yield loadSchema_1.loadSchema({ committish, glob }, shell);
            const user = schema.getType("User");
            const product = schema.getType("Product");
            chai_1.expect(user).not.to.be.undefined;
            chai_1.expect(product).not.to.be.undefined;
        });
    }
};
__decorate([
    mocha_typescript_1.test("load schema from glob pattern"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoadSchemaSpec.prototype, "loadGlobPattern", null);
__decorate([
    mocha_typescript_1.test("check for presence of git"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoadSchemaSpec.prototype, "checkForGit", null);
__decorate([
    mocha_typescript_1.test("load schema from committish:glob pattern"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoadSchemaSpec.prototype, "loadCommittishGlobPattern", null);
LoadSchemaSpec = __decorate([
    mocha_typescript_1.suite(mocha_typescript_1.timeout(300), mocha_typescript_1.slow(50))
], LoadSchemaSpec);
exports.LoadSchemaSpec = LoadSchemaSpec;
//# sourceMappingURL=loadSchema.spec.js.map