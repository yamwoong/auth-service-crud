"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const swaggerYamlPath = path_1.default.resolve(process.cwd(), 'swagger.yaml');
if (!fs_1.default.existsSync(swaggerYamlPath)) {
    throw new Error(`Swagger spec not found at ${swaggerYamlPath}`);
}
const yamlContent = fs_1.default.readFileSync(swaggerYamlPath, 'utf8');
const swaggerDocument = js_yaml_1.default.load(yamlContent);
exports.default = swaggerDocument;
