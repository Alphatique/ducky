import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/schema/index.ts', 'src/parquet.ts'],
	format: 'esm',
	bundle: true,
	external: ['@duckdb/duckdb-wasm', '@coji/kysely-duckdb-wasm'],
	dts: true,
	clean: true,
});
