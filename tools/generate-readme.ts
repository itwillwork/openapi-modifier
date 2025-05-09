import fs from 'fs';

const importRules: Array<string> = [];
const ruleTypes: Array<string> = [];

const IGNORE_ENTIRY_NAME = [
    'common',
    '.DS_Store',
    'generated-types.ts',
];

const LANGS = [
    'ru',
    // 'en',
    // 'zh'
];

const createPlaceholderRegExp = (placeholder: string) => {
    return new RegExp(`{{{${placeholder}}}}`, "g");
}

const LANG_SWITCHER_MD = '[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)';

const RULE_TABLE_ROW_TEMPLATE = `| [{{{name}}}](./src/rules/{{{name}}}/README.md) | {{{description}}} |\n`

LANGS.forEach((lang) => {
    const langPostfix = lang === "en" ? '' : `-${lang}`;

    const readmeTemplate = fs.readFileSync(`docs/drafts/${lang}/readme.md`).toString();

    const cliConfigWarningTemplate = fs.readFileSync(`docs/drafts/${lang}/sections/cli-config-warning.md`).toString();
    const cliParamsTemplate = fs.readFileSync(`docs/drafts/${lang}/sections/cli-params.md`).toString();

    const ruleListItemTemplate = fs.readFileSync(`docs/drafts/${lang}/sections/rule-short-details.md`).toString();
    const ruleTableHeader =  fs.readFileSync(`docs/drafts/${lang}/sections/rule-table-head.md`).toString();

    let ruleTableReadme = ruleTableHeader;
    let ruleListReadme = '';

    fs.readdirSync('src/rules').forEach((entityName, index) => {
        if (IGNORE_ENTIRY_NAME.includes(entityName)) {
            return;
        }

        console.log(`Generate entity name ${entityName}`);

        const configTemplate = fs.readFileSync(`src/rules/${entityName}/docs/_config.md`).toString();
        const descriptionTemplate = fs.readFileSync(`src/rules/${entityName}/docs/_description.md`).toString().trim();

        const ruleListItem = ruleListItemTemplate
            .replace(createPlaceholderRegExp("name"), entityName)
            .replace(createPlaceholderRegExp("config"), configTemplate)
            .replace(createPlaceholderRegExp("description"), descriptionTemplate);

        const ruleTableRow = RULE_TABLE_ROW_TEMPLATE
            .replace(createPlaceholderRegExp("name"), entityName)
            .replace(createPlaceholderRegExp("config"), configTemplate)
            .replace(createPlaceholderRegExp("description"), descriptionTemplate)

        ruleTableReadme += ruleTableRow;
        ruleListReadme += ruleListItem;
    });

    const readme =  readmeTemplate
        .replace(createPlaceholderRegExp("langSwitcher"), LANG_SWITCHER_MD)
        .replace(createPlaceholderRegExp("cliParams"), cliParamsTemplate)
        .replace(createPlaceholderRegExp("cliConfigWarning"), cliConfigWarningTemplate)
        .replace(createPlaceholderRegExp("ruleTable"), ruleTableReadme)
        .replace(createPlaceholderRegExp("rulesDescription"), ruleListReadme)
        .replace(createPlaceholderRegExp("langPostfix"), langPostfix)

    fs.writeFileSync(`README${langPostfix}.md`, readme);

    const debuggingTemplate = fs.readFileSync(`docs/drafts/${lang}/sections/debugging.md`).toString();

    const additionalReadMePages: Array<[string, string]> = [
        [`docs/drafts/${lang}/contributing.md`, 'contributing'],
        [`docs/drafts/${lang}/descriptor.md`, 'descriptor'],
        [`docs/drafts/${lang}/merge-vs-deepmerge.md`, 'merge-vs-deepmerge'],
        [`docs/drafts/${lang}/schema-diff.md`, 'schema-diff'],
        [`docs/drafts/${lang}/simple-text-file-modifier.md`, 'simple-text-file-modifier'],
    ];
    additionalReadMePages.forEach(([inputTemplatePath, outputPrefix]) => {
        const inputTemplate = fs.readFileSync(inputTemplatePath).toString();

        const additionalReadMeTemplate = `[🇺🇸 English](./${outputPrefix}.md) | [🇷🇺 Русский](./${outputPrefix}-ru.md)  | [🇨🇳 中文](./${outputPrefix}-zh.md)`;

        const output =  inputTemplate
            .replace(createPlaceholderRegExp("langSwitcher"), additionalReadMeTemplate)
            .replace(createPlaceholderRegExp("debugging"), debuggingTemplate)

        fs.writeFileSync(`docs/${outputPrefix}${langPostfix}.md`, output);
    })
});






