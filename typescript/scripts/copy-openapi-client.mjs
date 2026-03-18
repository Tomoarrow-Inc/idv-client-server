/**
 * Copy OpenAPI-generated client from ci into idv-client-server/src/sdk/generated/.
 * Run from idv-client-server/typescript root: node scripts/copy-openapi-client.mjs
 * Or from ci after gen: node ../idv-client-server/typescript/scripts/copy-openapi-client.mjs
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const source = join(__dirname, '..', '..', '..', 'ci', 'contracts', 'openapi-generator', 'generated', 'idv-client-server');
const dest = join(__dirname, '..', 'src', 'sdk', 'generated');

if (!existsSync(source)) {
  console.error('Source not found:', source);
  console.error('Run "npm run gen" in the ci folder first.');
  process.exit(1);
}

mkdirSync(dest, { recursive: true });
cpSync(source, dest, { recursive: true, force: true });
console.log('Copied OpenAPI client to', dest);
