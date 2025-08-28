import { createDucky } from '@alphatique/ducky';
import { datatypes } from '@coji/kysely-duckdb-wasm';

import * as schema from './schema';

const ducky = createDucky({
	schema,
	logger: 'console',
});

{
	await ducky
		.insertInto('user')
		.values([
			{
				id: 1,
				name: 'John',
				status: 'active',
			},
			{
				id: 2,
				name: 'Jane',
				status: 'inactive',
			},
			{
				id: 3,
				name: 'Mike',
				status: 'active',
			},
			{
				id: 4,
				name: 'Chris',
				status: 'inactive',
			},
		])
		.execute();

	await ducky
		.insertInto('user')
		.values([
			{
				id: 1,
				name: 'John Philips',
				status: 'active',
			},
		])
		.onConflict(oc =>
			oc.column('id').doUpdateSet({
				name: eb => eb.ref('excluded.name'),
				status: eb => eb.ref('excluded.status'),
			}),
		)
		.execute();

	await ducky.deleteFrom('user').where('status', '=', 'inactive').execute();

	const users = await ducky.selectFrom('user').selectAll().execute();
	console.log('users:', JSON.stringify(users, null, 2));
}

{
	await ducky
		.insertInto('post')
		.values([
			{
				id: 1,
				user_id: 1,
				title: 'Hello, world!',
				tags: datatypes.list(['hello', 'world']),
				content: 'Hello, world!',
			},
		])
		.execute();

	const posts = await ducky.selectFrom('post').selectAll().execute();
	console.log('posts:', JSON.stringify(posts, null, 2));
}

{
	await ducky.insertBlob('post', 'json', [
		new File(
			[
				JSON.stringify({
					id: 2,
					user_id: 1,
					title: 'Hello, world!',
					tags: ['hello', 'world'],
					content: 'Hello, world!',
				}),
			],
			'post.json',
		),
	]);
	const posts = await ducky.selectFrom('post').selectAll().execute();
	console.log('posts:', JSON.stringify(posts, null, 2));
}
