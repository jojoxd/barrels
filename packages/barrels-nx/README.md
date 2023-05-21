# @jojoxd/barrels-nx

Run [@jojoxd/barrels](https://npmjs.com/package/@jojoxd/barrels) using NX.

```shell
yarn install -D @jojoxd/barrels @jojoxd/barrels-nx
```

## Generators

### @jojoxd/barrels:configuration

Configure @jojoxd/barrels for a project, including barrels target

```shell
nx generate @jojoxd/barrels:configuration <project>
```

Or use it in your own generator:

```typescript
// generator.ts
import { configurationGenerator, ConfigurationGeneratorSchema } from "@jojoxd/barrels-nx";
import { Schema } from "./schema";

export default async function(tree: Tree, schema: Schema & ConfigurationGeneratorSchema): Promise<void>
{
    await configurationGenerator(tree, schema);
}
```

## Executors

### @jojoxd/barrels:generate

Execute barrels

```json
{
  "targets": {
    "barrels": {
      "executor": "@jojoxd/barrels:generate",
      
      "options": {
        "TODO": "Options reference"
      }
    }
  }
}
```
