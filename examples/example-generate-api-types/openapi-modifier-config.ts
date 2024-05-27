import {ConfigT} from 'openapi-modifier';

const config: ConfigT = {
    pipeline: [
        // remove basepath
        // filter service paths
        // filter only json formats
        // JIRA-10207 - new feature API for epic JIRA-232
        // JIRA-10209 - remove deprecated endpoint parameter, waiting JIRABACK-1235
        // JIRA-10211 - wrong API types, waiting JIRABACK-3434
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