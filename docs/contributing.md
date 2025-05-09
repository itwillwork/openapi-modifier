[🇺🇸 English](./contributing.md) | [🇷🇺 Русский](./contributing-ru.md)  | [🇨🇳 中文](./contributing-zh.md)

# Adding a New Rule

You need to add a folder with the name of the newly created rule to the `src/rules` directory with 6 files:

- `index.ts` - main file with rule logic - must export: `processor` (default export) and `configSchema` (named export)
- `index.test.ts` - tests for the rule covering all configuration fields and usage examples
- `/docs/{lang}/_description.md` - file with rule description
- `/docs/{lang}/_motivation.md` - file with description of rule motivation with examples (in which cases it can be useful in practice)
- `/docs/{lang}/_config.md` - file with rule configuration description

For detailed logs needed for debugging [see "Debugging" section](#custom_anchor_debug).

All rule names must start with an action designation.

## Project Structure

```
src/
├── cli/          # CLI interface
├── config.ts     # Configuration and validation
├── core/         # Core logic
├── logger/       # Logging system
├── openapi.ts    # OpenAPI file handling
├── rules/        # Modification rules
└── index.ts      # Entry point
```

## Development

### Installing Dependencies

```bash
npm install
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Additional Commands

- `npm run clear` - Clean build directories
- `npm run format` - Code formatting
- `npm run tools:generate-readme` - Documentation generation
- `npm run tools:generate-rule-types` - Rule types generation

<a name="custom_anchor_debug"></a>

## Debugging

Internally uses the npm package [debug](https://www.npmjs.com/package/debug) for detailed logging

To output all debug logs:

```bash
DEBUG=openapi-modifier:* openapi-modifier
```

To output debug logs for a specific rule, for example for the `remove-operation-id` rule:

```bash
DEBUG=openapi-modifier:rule:remove-operation-id openapi-modifier
``` 