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

const RULE_README_TEMPLATE = `# {{{name}}}

{{{description}}}

## Config

{{{config}}}

## Motivation

{{{motivation}}}
`

fs.readdirSync('src/rules').forEach((entityName, index) => {
    if (IGNORE_ENTIRY_NAME.includes(entityName)) {
        return;
    }

    const configReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/config.md`).toString();
    const descriptionReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/description.md`).toString();
    const motivationReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/motivation.md`).toString();

    const ruleReadme = RULE_README_TEMPLATE
        .replace('{{{name}}}', entityName)
        .replace('{{{config}}}', configReadmeContent)
        .replace('{{{description}}}', descriptionReadmeContent)
        .replace('{{{motivation}}}', motivationReadmeContent);

    fs.writeFileSync(`src/rules/${entityName}/README.md`, ruleReadme);
});

