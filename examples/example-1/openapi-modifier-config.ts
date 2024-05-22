import {ConfigT} from 'openapi-modifier';

const config: ConfigT = {
    pipeline: [
        {
            rule: 'remove-operation-id',
            config: {
                map: {}
            }
        },
    ],
};

export default config;