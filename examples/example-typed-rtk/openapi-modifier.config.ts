import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    // add basepath to all endpoints
    {
      rule: 'change-endpoints-basepath',
      config: {
        map: {
          '': '/api',
        },
      },
    }
  ],
};

export default config;
