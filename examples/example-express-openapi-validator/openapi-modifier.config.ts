import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    // add basepath
    {
      rule: 'change-endpoints-basepath',
      config: {
        map: {
          '/': '/api/v3/',
        },
      },
    },
    // filter paths
    {
      rule: 'filter-endpoints',
      config: {
        enabled: [
            'GET /api/v3/pet/{petId}'
        ],
      },
    },
    {
      rule: 'remove-unused-components',
    },
  ],
};

export default config;


