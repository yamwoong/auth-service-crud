import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';

const swaggerYamlPath = path.resolve(process.cwd(), 'swagger.yaml');

if (!fs.existsSync(swaggerYamlPath)) {
  throw new Error(`Swagger spec not found at ${swaggerYamlPath}`);
}

const yamlContent = fs.readFileSync(swaggerYamlPath, 'utf8');
const swaggerDocument = yaml.load(yamlContent) as OpenAPIV3.Document;

export default swaggerDocument;
