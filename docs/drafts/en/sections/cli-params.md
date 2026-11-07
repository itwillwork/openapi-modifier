CLI parameters:

| Option   | Description                                                                                              | Example                      | Default                                      |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**required**] input file, openapi specification/documentation                                          | `input/openapi.yml`          |                                              |
| `output` | [**required**] output file, openapi specification/documentation                                         | `output/openapi.yml`         |                                              |
| `config` | path to the configuration file. For detailed configuration description [see below](#custom_anchor_config_parameters) | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` |
| `verbose` | Show each rule execution and its diff in the console, and save a complete log to a temporary file. | `--verbose` | `false` |
| `minLevel` | Minimum console log level: `0` trace, `1` info, `2` not-important-warning, `3` warning, `4` error, `5` success. | `--minLevel 0` | `2` (unless configured) |
