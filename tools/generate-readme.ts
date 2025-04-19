import fs from 'fs';

const importRules: Array<string> = [];
const ruleTypes: Array<string> = [];

const IGNORE_ENTIRY_NAME = [
    'common',
    'generated-types.ts',
    'patch-endpoint-request-body-schema', // TODO remove
    'change-endpoints-basepath', // TODO remove
    'patch-endpoint-response-schema', // TODO remove
    'patch-endpoint-schema', // TODO remove
    'filter-by-content-type', // TODO remove
    'remove-deprecated', // TODO remove
    'filter-endpoints', // TODO remove
    'remove-max-items', // TODO remove
    'remove-min-items', // TODO remove
    'merge-openapi-spec', // TODO remove
    'remove-operation-id', // TODO remove
    'patch-component-schema', // TODO remove
    'remove-parameter', // TODO remove
    'patch-endpoint-parameter-schema', // TODO remove
    'remove-unused-components', // TODO remove
];

const LANGS = [
    'ru',
    // 'en',
    // 'zh'
];

const LANG_SWITCHER_MD = '[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)';

const RULE_TABLE_ROW_TEMPLATE = `| [{{{name}}}](./src/rules/{{{name}}}/README.md) | {{{description}}} |`

LANGS.forEach((lang) => {
    const langPostfix = lang === "en" ? '' : `-${lang}`;

    const readmeTemplate = fs.readFileSync(`docs/drafts-${lang}/readme.md`).toString();

    const cliConfigWarningTemplate = fs.readFileSync(`docs/drafts-${lang}/sections/cli-config-warning.md`).toString();
    const cliParamsTemplate = fs.readFileSync(`docs/drafts-${lang}/sections/cli-params.md`).toString();

    const ruleListItemTemplate = fs.readFileSync(`docs/drafts-${lang}/sections/rule-short-details.md`).toString();
    const ruleTableHeader =  fs.readFileSync(`docs/drafts-${lang}/sections/rule-table-head.md`).toString();

    let ruleTableReadme = ruleTableHeader;
    let ruleListReadme = '';

    fs.readdirSync('src/rules').forEach((entityName, index) => {
        if (IGNORE_ENTIRY_NAME.includes(entityName)) {
            return;
        }

        const configTemplate = fs.readFileSync(`src/rules/${entityName}/docs/_config.md`).toString();
        const descriptionTemplate = fs.readFileSync(`src/rules/${entityName}/docs/_description.md`).toString();

        const ruleListItem = ruleListItemTemplate
            .replace('{{{name}}}', entityName)
            .replace('{{{config}}}', configTemplate)
            .replace('{{{description}}}', descriptionTemplate);

        const ruleTableRow = RULE_TABLE_ROW_TEMPLATE
            .replace('{{{name}}}', entityName)
            .replace('{{{config}}}', configTemplate)
            .replace('{{{description}}}', descriptionTemplate)

        ruleTableReadme += ruleTableRow;
        ruleListReadme += ruleListItem;
    });

    const readme =  readmeTemplate
        .replace('{{{langSwitcher}}}', LANG_SWITCHER_MD)
        .replace('{{{cliParams}}}', cliParamsTemplate)
        .replace('{{{cliConfigWarning}}}', cliConfigWarningTemplate)
        .replace('{{{ruleTable}}}', ruleTableReadme)
        .replace('{{{rulesDescription}}}', ruleListReadme)
        .replace('{{{langPostfix}}}', langPostfix)

    fs.writeFileSync(`README${langPostfix}.md`, readme);
});






