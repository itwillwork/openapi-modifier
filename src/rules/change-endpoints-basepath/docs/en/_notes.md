### About operation collision handling and the ignoreOperarionCollisions parameter

The rule checks for operation collisions when changing paths. If a conflict occurs after path replacement (for example, two different endpoints become the same), the rule will throw an error.

Example of a collision:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
  /v1/pets:
    get:
      summary: Get pet by id
```

When trying to replace `/api/v1` with `/v1`, a conflict will occur as both endpoints will become `/v1/pets`.

In this case, you can:
1. Use `ignoreOperarionCollisions: true` to ignore conflicts
2. Change the path replacement configuration to avoid conflicts
3. Modify conflicting endpoints beforehand 