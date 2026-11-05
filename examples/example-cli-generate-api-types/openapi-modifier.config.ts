import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    // JIRA-10207 - new feature API for epic JIRA-232
    {
      rule: 'merge-openapi-spec',
      config: {
        path: 'input/feature-openapi-JIRA-232.yaml',
      },
    },
    // remove basepath
    {
      rule: 'change-endpoints-basepath',
      config: {
        map: {
          '/api/external': '',
        },
      },
    },
    // filter internal paths
    {
      rule: 'filter-endpoints',
      config: {
        disabledPathRegExp: [/\internal/],
      },
    },
    // JIRA-10209 - remove deprecated endpoint parameter, waiting JIRABACKEND-1235
    {
      rule: 'remove-parameter',
      config: {
        endpointDescriptor: {
          path: '/v1/pets',
          method: 'get',
        },
        parameterDescriptor: {
          name: 'tag',
          in: 'query',
        },
      },
    },
    // JIRA-10211 - wrong docs, waiting JIRABACKEND-3434
    {
      rule: 'patch-endpoint-parameter-schema',
      config: {
        endpointDescriptor: {
          method: 'get',
          path: '/v1/pets',
        },
        parameterDescriptor: {
          name: 'search',
          in: 'path',
        },
        patchMethod: 'merge',
        schemaDiff: {
          type: 'string',
        },
        objectDiff: {
          in: 'query',
          required: true,
        },
      },
    },
    // JIRA-2319 - wrong body, waiting JIRABACKEND-12323
    {
      rule: 'patch-endpoint-request-body-schema',
      config: {
        endpointDescriptor: { path: '/v1/tags', method: 'post' },
        contentType: 'application/json',
        patchMethod: 'deepmerge',
        schemaDiff: {
          properties: { color: { type: 'string' } },
        },
      },
    },
    // JIRA-10212 - wrong docs, waiting JIRABACKEND-8752
    {
      rule: 'patch-component-schema',
      config: {
        descriptor: { componentName: 'Pet' },
        patchMethod: 'deepmerge',
        schemaDiff: {
          properties: { id: { type: 'string', format: 'uuid' } },
        },
      },
    },
    // JIRA-11236 - removed deprecated endpoint, waiting JIRABACKEND-3641
    {
      rule: 'filter-endpoints',
      config: {
        disabled: [
          {
            path: '/v1/pets/{petId}',
            method: 'delete',
          },
        ],
      },
    },
    // removed for dtsgenerator
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [],
      },
    },
    {
      rule: 'remove-max-items',
    },
    {
      rule: 'remove-unused-components',
    },
  ],
};

export default config;
