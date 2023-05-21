# @jojoxd/barrels

Create barrels, using cli, or programmatically.

```shell
yarn install -D @jojoxd/barrels
```

## Usage

```shell
barrels -c barrels.json
# OR
barrels TODO: Add Options here
```

### Programmatic

```typescript
import { Barrels } from "@jojoxd/barrels";

const barrels = new Barrels();

await barrels.generate({
    ...options,
});
```

## Configuration

config file, or CLI options