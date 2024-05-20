// @ts-ignore TODO not compile example
import {ConfigT, RuleConfig} from 'openapi-modifier';

const typedPipeline: Array<RuleConfig> = [
    {
        map: { },
    },
];

const config: ConfigT = {
    pipeline: [
        {
            rule: 'remove-operation-id',
        },
    ],
};

export default config;