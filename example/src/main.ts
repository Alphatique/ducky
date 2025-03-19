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
	await ducky.user.insert({
		values: [
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
		],
	});

	await ducky.user.delete({
		where: (t, { lte }) => lte(t.age, 22),
	});

	const users = await ducky.user.select();
	console.log('users:', JSON.stringify(users, null, 2));
}

{
	await ducky.post.insert({
		values: [
			{
				id: 1,
				userId: 1,
				title: 'Hello, world!',
				tags: ['hello', 'world'],
				content: 'Hello, world!',
			},
		],
	});

	const posts = await ducky.post.select();
	console.log('posts:', JSON.stringify(posts, null, 2));
}
