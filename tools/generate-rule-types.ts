import fs from 'fs';

const IMPORT_RULE_TEMPLATE = `import { configSchema as {{configSchema}}} from "./{{name}}";`;
const RULE_TYPE_TEMPLATE = `| BasePipelineRule<'{{name}}', z.infer<typeof {{configSchema}}>>`;

const TEMPLATE = `
/****************************************
 * WARNING! This file is autogenerated. *
 ****************************************/

import { z } from 'zod';

{{ruleImports}}

type BasePipelineRule<Rule extends string, RuleConfig extends object> = {
    rule: Rule;
    disabled?: boolean;
    config?: RuleConfig;
}

export type AnyPipelineRule =
    {{ruleTypes}};
`;

const importRules: Array<string> = [];
const ruleTypes: Array<string> = [];

const IGNORE_ENTIRY_NAME = [
  'common',
  '.DS_Store',
  'generated-types.ts',
];

fs.readdirSync('src/rules').forEach((entityName, index) => {
  if (IGNORE_ENTIRY_NAME.includes(entityName)) {
    return;
  }

  const name = entityName;
  const configSchema = `configSchema_${index}`;

  importRules.push(IMPORT_RULE_TEMPLATE.replace('{{configSchema}}', configSchema).replace('{{name}}', name));

  ruleTypes.push(RULE_TYPE_TEMPLATE.replace('{{configSchema}}', configSchema).replace('{{name}}', name));
});

const result = TEMPLATE.replace('{{ruleImports}}', importRules.join('\n')).replace('{{ruleTypes}}', ruleTypes.join('\n'));

fs.writeFileSync('src/rules/generated-types.ts', result);
