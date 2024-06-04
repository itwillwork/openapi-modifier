import { openapiModifier } from 'openapi-modifier';

(async () => {
  try {
    await openapiModifier({
      input: 'input/openapi.yml',
      output: 'output/openapi.yml',
      pipeline: [
        {
          rule: 'remove-operation-id',
          config: {
            ignore: [],
          },
        },
      ],
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
