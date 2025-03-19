import { integer, table, text } from '@alphatique/ducky/schema';

export const user = table('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	age: integer('age').notNull(),
});

export const post = table('post', {
	id: integer('id').primaryKey(),
	userId: integer('user_id').notNull(),
	title: text('title').notNull(),
	tags: text('tags').list().notNull(),
	content: text('content').notNull(),
});
