import fs from 'fs';
import path from 'path';

// Resolve from the script, so generation does not depend on the working directory.
const root = path.resolve(__dirname, '..');

const RULE_TABLE_ROW_TEMPLATE = `| [{{{name}}}](dist-docs/skills/{{{name}}}.md) | {{{description}}} |`;
const RULE_COMMAND_TEMPLATE = '- `openapi-modifier skill {{{name}}}`';

const createPlaceholderRegExp = (placeholder: string) => {
    return new RegExp(`{{{${placeholder}}}}`, "g");
}

const getTemplate = (
    templatePath: string,
): string => {
    return fs.readFileSync(path.join(root, templatePath)).toString().trim();
}

const rulesDirectory = path.join(root, 'src/rules');
const ruleNames = fs.readdirSync(rulesDirectory).filter((ruleName) => {
    return fs.existsSync(path.join(rulesDirectory, ruleName, 'index.ts')) &&
        fs.existsSync(path.join(rulesDirectory, ruleName, 'README.md'));
}).sort();

const overviewTemplate = fs.readFileSync(path.join(root, 'docs/drafts/en/llms.txt')).toString();
const ruleTableHeader = getTemplate('docs/drafts/en/sections/rule-table-head.md');

let ruleTable = ruleTableHeader;
const ruleCommands: Array<string> = [];

ruleNames.forEach((ruleName) => {
    const descriptionTemplate = getTemplate(`src/rules/${ruleName}/docs/en/_description.md`).replace(/\s+/g, ' ');

    const ruleTableRow = RULE_TABLE_ROW_TEMPLATE
        .replace(createPlaceholderRegExp("name"), () => ruleName)
        .replace(createPlaceholderRegExp("description"), () => descriptionTemplate);

    const ruleCommand = RULE_COMMAND_TEMPLATE
        .replace(createPlaceholderRegExp("name"), () => ruleName);

    ruleTable += '\n' + ruleTableRow;
    ruleCommands.push(ruleCommand);
});

const cliParamsTemplate = getTemplate('docs/drafts/en/sections/cli-params.md');
const cliConfigWarningTemplate = getTemplate('docs/drafts/en/sections/cli-config-warning.md');
const faqTemplate = getTemplate('docs/drafts/en/sections/faq.md');
const configurationTemplate = getTemplate('docs/drafts/en/sections/configuration.md');
const programmaticUsageTemplate = getTemplate('docs/drafts/shared/programmatic-usage.md');

const instructions = overviewTemplate
    .replace(createPlaceholderRegExp("programmaticUsage"), () => programmaticUsageTemplate)
    .replace(createPlaceholderRegExp("configuration"), () => configurationTemplate)
    .replace(createPlaceholderRegExp("faq"), () => faqTemplate)
    .replace(createPlaceholderRegExp("cliParams"), () => cliParamsTemplate.replace(/#custom_anchor_config_parameters/g, '#configuration'))
    .replace(createPlaceholderRegExp("cliConfigWarning"), () => cliConfigWarningTemplate.replace(/#custom_anchor_config_parameters/g, '#configuration'))
    .replace(createPlaceholderRegExp("ruleCommands"), () => ruleCommands.join('\n'))
    .replace(createPlaceholderRegExp("ruleTable"), () => ruleTable);

fs.writeFileSync(path.join(root, 'llms.txt'), instructions);

console.log(`Generated llms.txt for ${ruleNames.length} rules.`);
