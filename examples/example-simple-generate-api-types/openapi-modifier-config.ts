import {ConfigT} from 'openapi-modifier';

const config: ConfigT = {
    pipeline: [
        // remove basepath
        {
            rule: 'change-endpoints-basepath',
            config: {
                map: {
                    "/api/external": ""
                }
            }
        },
        // filter internal paths
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [/\internal/],
            }
        },
        {
            rule: 'remove-unused-components'
        },
    ],
};

export default config;