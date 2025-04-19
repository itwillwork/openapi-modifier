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

LANGS.forEach((lang) => {
    const langPostfix = lang === "en" ? '' : `-${lang}`;

    const ruleTemplate = fs.readFileSync(`docs/drafts-${lang}/rule-details.md`).toString();

    fs.readdirSync('src/rules').forEach((entityName, index) => {
        if (IGNORE_ENTIRY_NAME.includes(entityName)) {
            return;
        }

        const configReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/_config.md`).toString();
        const descriptionReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/_description.md`).toString();
        const motivationReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/_motivation.md`).toString();

        const ruleReadme = ruleTemplate
            .replace('{{{langSwitcher}}}', LANG_SWITCHER_MD)
            .replace('{{{name}}}', entityName)
            .replace('{{{config}}}', configReadmeContent)
            .replace('{{{description}}}', descriptionReadmeContent)
            .replace('{{{motivation}}}', motivationReadmeContent)
            .replace('{{{langPostfix}}}', langPostfix);

        fs.writeFileSync(`src/rules/${entityName}/README${langPostfix}.md`, ruleReadme);
    });
});
