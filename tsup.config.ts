import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/schema/index.ts', 'src/types.ts'],
	format: 'esm',
	bundle: true,
	external: ['@duckdb/duckdb-wasm'],
	dts: true,
	clean: true,
});
