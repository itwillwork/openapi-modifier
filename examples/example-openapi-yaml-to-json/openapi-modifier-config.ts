import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [],
      },
    },
  ],
};

export default config;
