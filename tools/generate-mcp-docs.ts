import fs from 'fs';
import path from 'path';

const RAW_GITHUB_MAIN_BRANCH_BASE_URL = 'https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main';

const IGNORE_ENTIRY_NAME = [
    'common',
    '.DS_Store',
    'generated-types.ts',
];

const LANGS = ['en', 'ru', 'zh'];

const createPlaceholderRegExp = (placeholder: string) => {
    return new RegExp(`{{{${placeholder}}}}`, 'g');
};

const getTemplate = (templatePath: string): string => {
    return fs.readFileSync(templatePath).toString().trim();
};

const RULE_TABLE_ROW_TEMPLATE = `| [{{{name}}}](${RAW_GITHUB_MAIN_BRANCH_BASE_URL}/src/rules/{{{name}}}/README{{{langPostfix}}}.md) | {{{description}}} |\n`;

const outDir = 'mcp/docs';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

LANGS.forEach((lang) => {
    const langPostfix = lang === 'en' ? '' : `-${lang}`;

    const ruleTableHeader = getTemplate(`docs/drafts/${lang}/sections/rule-table-head.md`);

    let ruleTableContent = ruleTableHeader + '\n';

    const ruleNames = fs.readdirSync('src/rules');

    ruleNames.forEach((ruleName) => {
        if (IGNORE_ENTIRY_NAME.includes(ruleName)) {
            return;
        }

        const descriptionPath = path.join('src/rules', ruleName, 'docs', lang, '_description.md');

        if (!fs.existsSync(descriptionPath)) {
            return;
        }

        console.log(`Add rule ${ruleName} to MCP docs table`);

        const descriptionTemplate = getTemplate(descriptionPath);

        const ruleTableRow = RULE_TABLE_ROW_TEMPLATE
            .replace(createPlaceholderRegExp('name'), ruleName)
            .replace(createPlaceholderRegExp('description'), descriptionTemplate)
            .replace(createPlaceholderRegExp('langPostfix'), langPostfix);

        ruleTableContent += ruleTableRow;
    });

    const content = [
        ruleTableContent,
    ].join('\n');

    const outFile = path.join(outDir, lang === 'en' ? 'rules.md' : `rules-${lang}.md`);
    fs.writeFileSync(outFile, content);

    console.log(`MCP rules docs table written to ${outFile}`);
});


console.log(`MCP docs generated successfully`);
