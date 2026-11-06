# Agent Instructions

## Writing OpenAPI Modifier configurations

Before creating or modifying an OpenAPI Modifier configuration, read
[llms.txt](llms.txt) and the relevant documents it links to.

Inspect the existing configuration and the target operation in the input OpenAPI
document. Use the syntax supported by the package version being used, preserve
existing pipeline steps and their order, and verify the resulting OpenAPI diff.

When working in a consuming project, read the documentation from its installed
`node_modules/openapi-modifier` package so that it matches the installed version.
If a required source is unavailable, explicitly report the unresolved gap.
