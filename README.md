# @alphatique/ducky

[![license](https://img.shields.io/npm/l/@alphatique/ducky)](https://github.com/alphatique/ducky/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@alphatique/ducky)](https://www.npmjs.com/package/@alphatique/ducky)
[![npm downloads](https://img.shields.io/npm/dm/@alphatique/ducky)](https://www.npmjs.com/package/@alphatique/ducky)

An ORM library for DuckDB Wasm.

## Installation

```sh
# Using npm
npm install @alphatique/ducky

# Using yarn
yarn add @alphatique/ducky

# Using pnpm
pnpm add @alphatique/ducky
```

## Usage

### Schema Definition

First, define your database schema using the provided schema builder:

```ts
import { integer, table, text } from '@alphatique/ducky/schema';

export const user = table('user', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
});
```

### Basic Setup

> [!IMPORTANT]
> The initialization process varies depending on your bundler (webpack, vite, etc.). For detailed instructions on how to initialize DuckDB Wasm with your specific bundler, please refer to the [official DuckDB Wasm documentation](https://duckdb.org/docs/stable/clients/wasm/instantiation.html).

Here's an example using Vite:

```ts
import { createDucky } from '@alphatique/ducky';

// Import DuckDB Wasm bundles
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';

// Import schema definition
import * as schema from './schema';

// Create Ducky instance
const ducky = createDucky({
    schema,
    bundles: {
        mvp: {
            mainModule: duckdb_wasm,
            mainWorker: mvp_worker,
        },
        eh: {
            mainModule: duckdb_wasm_eh,
            mainWorker: eh_worker,
        },
    },
    logger: 'console',
});
```

### Type Inference

You can infer types from your schema using the `$Infer` property:

```ts
type User = typeof ducky.user.$Infer;
```

This will give you the correct type for your table's data structure, which you can use for type safety when inserting or querying data.

### Select

```ts
const users = await ducky.user.select();
```

### Insert

#### JS Object

```ts
await ducky.user.insert({
    values: [
        { id: 1, name: 'John', age: 20 },
        { id: 2, name: 'Jane', age: 25 },
    ],
});
```

#### Parquet

```ts
await ducky.user.insert({
    type: 'parquet',
    files: [parquetFileBuffer],
    protocol: DuckDBDataProtocol.BUFFER,
});
```

#### Returning

```ts
const insertedUsers = await ducky.user.insert({
    /* ... */
    returning: true,
});
```

### Delete

```ts
const users = await ducky.user.delete({
    where: (t, { lte }) => lte(t.age, 22),
    returning: true,
});
```

## Dependencies

-   @duckdb/duckdb-wasm: ^1.29.0

## License

ISC
