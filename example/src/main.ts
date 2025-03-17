import { createDucky } from '@alphatique/ducky';

import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';

import * as schema from './schema';

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

{
	type User = typeof ducky.user.$Infer;

	const users: User[] = [
		{
			id: 1,
			name: 'John',
			age: 20,
		},
		{
			id: 2,
			name: 'Jane',
			age: 25,
		},
		{
			id: 3,
			name: 'Mike',
			age: 22,
		},
		{
			id: 4,
			name: 'Chris',
			age: 27,
		},
	];

	await ducky.user.insert({
		values: users,
		returning: true,
	});
}

{
	const users = await ducky.user.delete({
		where: (t, { lte }) => lte(t.age, 22),
		returning: true,
	});

	console.log(users);
}

{
	const users = await ducky.user.select();

	console.log(users);
}
