import {ConfigT} from 'openapi-modifier';

const config: ConfigT = {
    pipeline: [
        // remove for dtsgenerator
        {
            rule: 'remove-operation-id',
            config: {
                ignore: [],
            }
        },
    ],
};

export default config;