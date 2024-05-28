import {ConfigT} from 'openapi-modifier';
import {z} from "zod";

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
        {
            rule: "merge-openapi-spec",
            config: {
                path: "input/feature-openapi-JIRA-232.yaml"
            }
        },
        // JIRA-10209 - remove deprecated endpoint parameter, waiting JIRABACKEND-1235
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: {
                    path: '/v1/pets',
                    method: 'get'
                },
                parameterDescriptor: {
                    name: 'tag',
                    in: 'query',
                }
            }
        },
        // JIRA-10211 - wrong docs, waiting JIRABACKEND-3434
        {
          rule: "patch-parameter",
            config: {
                endpointDescriptor: {
                    method: 'get',
                    path: '/v1/pets'
                },
                parameterDescriptor: {
                    name: "search",
                    in: "path",
                },
                patchMethod: "merge",
                schemaDiff: {
                    type: "string"
                },
                objectDiff: {
                    in: "query",
                    required: true,
                }
            }
        },
        // JIRA-2319 - wrong body, waiting JIRABACKEND-12323
        {
            rule: "patch-schemas",
            config: {
                patchMethod: "merge",
                descriptor: {
                    type: "endpoint-request-body",
                    path: '/v1/tags',
                    method: 'post',
                    contentType: 'application/json',
                },
                schemaDiff: {
                    properties: {
                        color: {
                            type: "string"
                        }
                    }
                }
            }
        },
        // JIRA-10212 - wrong docs, waiting JIRABACKEND-8752
        {
            rule: "patch-schemas",
            config: {
                descriptor: {
                    type: "component-schema",
                    componentName: "Pet"
                },
                patchMethod: "replace",
                schemaDiff: {
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                }
            }
        },
        // JIRA-11236 - removed deprecated endpoint, waiting JIRABACKEND-3641
        {
            rule: "filter-endpoints",
            config: {
                disabled: [
                    {
                        path: '/v1/pets/{petId}',
                        method: 'delete',
                    }
                ]
            }
        },
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