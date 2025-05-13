import { createDucky } from '@alphatique/ducky';

import * as schema from './schema';

const ducky = createDucky({
	schema,
	logger: 'console',
});

{
	await ducky.user.insert({
		values: [
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
		],
	});

	await ducky.user.insert({
		onConflict: 'replace',
		values: [
			{
				id: 1,
				name: 'John Philips',
				status: 'active',
			},
		],
	});

	await ducky.user.delete({
		where: (t, { eq }) => eq(t.status, 'inactive'),
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
