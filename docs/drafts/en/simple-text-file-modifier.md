{{{langSwitcher}}}

# Simple Text File Modifier

A simple tool for modifying text files. Allows performing basic operations with text files, such as adding text to the beginning or end of a file, as well as replacing text using regular expressions.

## Motivation and Use Cases

For example, we generated [API typing](../examples/example-cli-generate-api-types/output/generated-api-types.d.ts).
And we want to explicitly mark for other developers: that the file should not be modified manually and rename some entities to more declarative names.
We write a [configuration file](../examples/example-cli-generate-api-types/simple-text-file-modifier.config.ts) describing all changes needed with explanatory comments.
Then [using this configuration file and simple-text-file-modifier cli](../examples/example-cli-generate-api-types/package.json#L9), we get a [modified API typing file](../examples/example-cli-generate-api-types/output/generated-api-types.d.ts).

## Installation

```bash
npm install --save-dev openapi-modifier
```

## Usage

```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

[Usage example](../examples/example-cli-generate-api-types/package.json#L9)

## Command Line Parameters

| Parameter | Description                                                                                                 | Example                                | Required |
| --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------ |
| **input** | Path to input file                                                                                    | `input/file.txt`                     | Yes           |
| **output**| Path to output file                                                                                   | `output/file.txt`                    | Yes           |
| **config**| Path to configuration file. Supported formats: js, ts, json, yaml, yml                               | `simple-text-file-modifier.config.js` | No          |
| **verbose**| Enable verbose output                                                                                 | `--verbose`                          | No          |

## Configuration

The configuration file can contain the following parameters:

| Parameter     | Type                                                             | Example                                                                 | Description                                                                                 |
| ------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **addAfter** | `string`                                                        | `"WARNING! This file was auto-generated"`                              | Text to be added to the end of the file                                              |
| **addBefore**| `string`                                                        | `"/// <reference types=\"../../a\" />"`                                | Text to be added to the beginning of the file                                             |
| **replace**  | `Array<{ searchValue: string \| RegExp; replaceValue: string }>`| `{ searchValue: /\ Components\./g, replaceValue: ' ApiComponents.' }`  | Array of replacements. Supports both strings and regular expressions                        |

## Configuration Examples

### JavaScript (simple-text-file-modifier.config.js)
```javascript
module.exports = {
    addBefore: "// This file was auto-generated. Do not edit manually.\n",
    addAfter: "\n// End of auto-generated file",
    replace: [
        {
            searchValue: /Components\./g,
            replaceValue: 'ApiComponents.'
        }
    ]
};
```

### TypeScript (simple-text-file-modifier.config.ts)
```typescript
export default {
    addBefore: "// This file was auto-generated. Do not edit manually.\n",
    addAfter: "\n// End of auto-generated file",
    replace: [
        {
            searchValue: /Components\./g,
            replaceValue: 'ApiComponents.'
        }
    ]
};
```

### JSON (simple-text-file-modifier.config.json)
```json
{
  "addBefore": "// This file was auto-generated. Do not edit manually.\n",
  "addAfter": "\n// End of auto-generated file",
  "replace": [
    {
      "searchValue": "Components.",
      "replaceValue": "ApiComponents."
    }
  ]
}
```

## Usage Examples

### Adding a Warning to the Beginning of a File
```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

Where `simple-text-file-modifier.config.js` contains:
```javascript
module.exports = {
    addBefore: "// WARNING: This file was auto-generated. Do not edit manually.\n"
};
```

### Replacing Text in a File
```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

Where `simple-text-file-modifier.config.js` contains:
```javascript
module.exports = {
    replace: [
        {
            searchValue: /old\.namespace\./g,
            replaceValue: 'new.namespace.'
        }
    ]
};
```

## Notes

- If the `--config` parameter is not specified, the utility will look for a configuration file named `simple-text-file-modifier.config` with extensions: js, ts, json, yaml, yml
- All operations are performed sequentially: first replacements, then adding text to the beginning, and finally - adding text to the end of the file
- When using regular expressions in JSON configuration, they need to be specified as strings 