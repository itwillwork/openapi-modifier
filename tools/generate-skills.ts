import fs from 'fs';
import path from 'path';

// Resolve from the script, so generation does not depend on the working directory.
const root = path.resolve(__dirname, '..');

const rulesDirectory = path.join(root, 'src/rules');
const ruleNames = fs.readdirSync(rulesDirectory).filter((ruleName) => {
    return fs.existsSync(path.join(rulesDirectory, ruleName, 'index.ts')) &&
        fs.existsSync(path.join(rulesDirectory, ruleName, 'README.md'));
}).sort();

const outputDirectory = path.join(root, 'dist-docs/skills');
fs.mkdirSync(outputDirectory, {recursive: true});

ruleNames.forEach((ruleName) => {
    const ruleReadmeTemplate = fs.readFileSync(path.join(rulesDirectory, ruleName, 'README.md')).toString();

    const guide = ruleReadmeTemplate
        .replace(/^.*\[🇺🇸 English\].*\n/, '')
        .replace(/\.\.\/\.\.\/\.\.\/docs\//g, 'https://github.com/itwillwork/openapi-modifier/blob/main/docs/')
        .replace(/\.\.\/\.\.\/\.\.\//g, '../../');

    fs.writeFileSync(path.join(outputDirectory, `${ruleName}.md`), guide.trim() + '\n');
});

console.log(`Generated instructions for ${ruleNames.length} rules.`);
