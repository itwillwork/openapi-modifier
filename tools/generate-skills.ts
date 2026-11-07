import fs from 'fs';
import path from 'path';

// Resolve from the script, so generation does not depend on the working directory.
const root = path.resolve(__dirname, '..');
const rulesDirectory = path.join(root, 'src/rules');
const ruleNames = fs.readdirSync(rulesDirectory).filter((name) =>
    fs.existsSync(path.join(rulesDirectory, name, 'index.ts')) &&
    fs.existsSync(path.join(rulesDirectory, name, 'README.md'))
).sort();
const outputDirectory = path.join(root, 'dist-docs/skills');
fs.mkdirSync(outputDirectory, {recursive: true});

const overview = fs.readFileSync(path.join(root, 'docs/drafts/en/llms.txt'), 'utf8');
const ruleTableHeader = fs.readFileSync(path.join(root, 'docs/drafts/en/sections/rule-table-head.md'), 'utf8').trim();
const ruleTable = ruleTableHeader + '\n' + ruleNames.map((name) => {
    const description = fs.readFileSync(
        path.join(rulesDirectory, name, 'docs/en/_description.md'), 'utf8'
    ).trim().replace(/\s+/g, ' ');
    return `| [${name}](dist-docs/skills/${name}.md) | ${description} |`;
}).join('\n');
const cliParams = fs.readFileSync(path.join(root, 'docs/drafts/en/sections/cli-params.md'), 'utf8').trim();
const cliConfigWarning = fs.readFileSync(path.join(root, 'docs/drafts/en/sections/cli-config-warning.md'), 'utf8').trim();
const faq = fs.readFileSync(path.join(root, 'docs/drafts/en/sections/faq.md'), 'utf8').trim();
const configuration = fs.readFileSync(path.join(root, 'docs/drafts/en/sections/configuration.md'), 'utf8').trim();
const programmaticUsage = fs.readFileSync(path.join(root, 'docs/drafts/shared/programmatic-usage.md'), 'utf8').trim();
const instructions = overview
    .replace(/{{{programmaticUsage}}}/g, () => programmaticUsage)
    .replace(/{{{configuration}}}/g, () => configuration)
    .replace(/{{{faq}}}/g, () => faq)
    .replace(/{{{cliParams}}}/g, () => cliParams.replace(/#custom_anchor_config_parameters/g, '#configuration'))
    .replace(/{{{cliConfigWarning}}}/g, () => cliConfigWarning.replace(/#custom_anchor_config_parameters/g, '#configuration'))
    .replace(/{{{ruleCommands}}}/g,
        ruleNames.map((name) => `- \`openapi-modifier skill ${name}\``).join('\n'))
    .replace(/{{{ruleTable}}}/g, () => ruleTable);
fs.writeFileSync(path.join(root, 'llms.txt'), instructions);

for (const name of ruleNames) {
    const guide = fs.readFileSync(path.join(rulesDirectory, name, 'README.md'), 'utf8')
        .replace(/^.*\[🇺🇸 English\].*\n/, '')
        .replace(/\.\.\/\.\.\/\.\.\//g, '../../')
        .replace(/\]\(\.\/index\.test\.ts\)/g, `](../../src/rules/${name}/index.test.ts)`);
    fs.writeFileSync(path.join(outputDirectory, `${name}.md`), guide.trim() + '\n');
}
console.log(`Generated llms.txt and instructions for ${ruleNames.length} rules.`);
