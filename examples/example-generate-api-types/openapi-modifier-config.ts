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
        // JIRA-10207 - new feature API for epic JIRA-232
        // merge-openapi-spec
        // JIRA-10209 - remove deprecated endpoint parameter, waiting JIRABACK-1235
        // remove-parameter
        // JIRA-10211 - wrong docs, waiting JIRABACK-3434
        // patch-schemas
        // JIRA-10212 - wrong docs, waiting JIRABACK-8752
        // patch-parameter
        // JIRA-11236 - removed deprecated endpoint, waiting JIRABACK-3641
        // filter-endpoints
        // removed for dtsgenerator
        {
            rule: 'remove-operation-id',
            config: {
                ignore: [],
            }
        },
        {
            rule: 'remove-max-items',
        },
        {
            rule: 'remove-unused-components'
        },
    ],
};

export default config;