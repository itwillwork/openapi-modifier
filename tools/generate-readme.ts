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

const RULE_LIST_ITEM_TEMPLATE = `<a name="custom_anchor_rule_{{{name}}}"></a>
### {{{name}}}

{{{description}}}

#### Config

{{{config}}}

[Подрбонее про правило {{{name}}}](./src/rules/{{{name}}}/README.md)
`

const RULE_TABLE_ROW_TEMPLATE = `| [{{{name}}}](./src/rules/{{{name}}}/README.md) | {{{description}}} |`

let ruleTableReadme = `
| Правило | Краткое описание |
| -- | -- |
`;
let ruleListReadme = '';

fs.readdirSync('src/rules').forEach((entityName, index) => {
    if (IGNORE_ENTIRY_NAME.includes(entityName)) {
        return;
    }

    const configReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/_config.md`).toString();
    const descriptionReadmeContent = fs.readFileSync(`src/rules/${entityName}/docs/_description.md`).toString();

    const ruleListItem = RULE_LIST_ITEM_TEMPLATE
        .replace(/\{\{\{name\}\}\}/g, entityName)
        .replace('{{{config}}}', configReadmeContent)
        .replace('{{{description}}}', descriptionReadmeContent);

    const ruleTableRow = RULE_TABLE_ROW_TEMPLATE
        .replace(/\{\{\{name\}\}\}/g, entityName)
        .replace('{{{config}}}', configReadmeContent)
        .replace('{{{description}}}', descriptionReadmeContent)

    ruleTableReadme += ruleTableRow;
    ruleListReadme += ruleListItem;
});

fs.writeFileSync(`_README.md`, `
# List
${ruleListReadme}

# Table
${ruleTableReadme}
`);


