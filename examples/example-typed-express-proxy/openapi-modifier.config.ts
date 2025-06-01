import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    // remove operation id for all operations, for get more readable types from dtsgenerator
    {
      rule: 'remove-operation-id',
    },
  ],
};

export default config;
