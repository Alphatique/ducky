import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/schema/index.ts'],
	format: 'esm',
	bundle: true,
	external: ['@duckdb/duckdb-wasm'],
	dts: {
		entry: ['src/index.ts', 'src/schema/index.ts', 'src/types.ts'],
	},
	clean: true,
});
