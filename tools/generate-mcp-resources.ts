import fs from 'fs';
import path from 'path';

const IGNORE_ENTIRY_NAME = [
    'common',
    '.DS_Store',
    'generated-types.ts',
];

const outDir = 'mcp/resources';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const ruleNames = fs.readdirSync('src/rules')
    .filter((ruleName) => !IGNORE_ENTIRY_NAME.includes(ruleName))
    .sort();

const rulesJson = JSON.stringify(ruleNames, null, 4);

const outFile = path.join(outDir, 'rules.json');
fs.writeFileSync(outFile, rulesJson + '\n');

console.log(`MCP resources rules.json written to ${outFile}`);
console.log(`Found ${ruleNames.length} rules: ${ruleNames.join(', ')}`);

console.log(`MCP resources generated successfully`);
