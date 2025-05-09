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
    'en',
    'zh'
];

const createPlaceholderRegExp = (placeholder: string) => {
    return new RegExp(`{{{${placeholder}}}}`, "g");
}

const LANG_SWITCHER_MD = '[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)';

const getReadmeContent = (
    path: string,
): string => {
    return fs.readFileSync(path).toString().trim();
}

const getReadmeContentIfExist = (
    path: string,
    placeholder: string
): string => {
    if (fs.existsSync(path)) {
        return getReadmeContent(path);
    }

    return placeholder;
}

LANGS.forEach((lang) => {
    const langPostfix = lang === "en" ? '' : `-${lang}`;

    const ruleTemplate = fs.readFileSync(`docs/drafts/${lang}/rule-details.md`).toString();

    fs.readdirSync('src/rules').forEach((entityName, index) => {
        if (IGNORE_ENTIRY_NAME.includes(entityName)) {
            return;
        }

        console.log(`Generate docs for rule ${entityName}...`);

        const configReadmeContent = getReadmeContent(`src/rules/${entityName}/docs/${lang}/_config.md`);
        const descriptionReadmeContent = getReadmeContent(`src/rules/${entityName}/docs/${lang}/_description.md`);
        const motivationReadmeContent = getReadmeContent(`src/rules/${entityName}/docs/${lang}/_motivation.md`);

        const notesReadmeContent = getReadmeContentIfExist(`src/rules/${entityName}/docs/${lang}/_notes.md`, '-');
        const linksReadmeContent = getReadmeContentIfExist(`src/rules/${entityName}/docs/${lang}/_links.md`, '');
        const afterDescriptorReadmeContent = getReadmeContentIfExist(`src/rules/${entityName}/docs/${lang}/_after-descriptor.md`, '');

        const ruleReadme = ruleTemplate
            .replace(createPlaceholderRegExp("langSwitcher"), LANG_SWITCHER_MD)
            .replace(createPlaceholderRegExp("name"), entityName)
            .replace(createPlaceholderRegExp("config"), configReadmeContent)
            .replace(createPlaceholderRegExp("description"), descriptionReadmeContent)
            .replace(createPlaceholderRegExp("afterDescription"), afterDescriptorReadmeContent)
            .replace(createPlaceholderRegExp("motivation"), motivationReadmeContent)
            .replace(createPlaceholderRegExp("notes"), notesReadmeContent)
            .replace(createPlaceholderRegExp("links"), linksReadmeContent)
            .replace(createPlaceholderRegExp("rootPath"), '../../../')
            .replace(createPlaceholderRegExp("langPostfix"), langPostfix)

        fs.writeFileSync(`src/rules/${entityName}/README${langPostfix}.md`, ruleReadme);
    });
});
