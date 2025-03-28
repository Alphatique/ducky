import {
	_enum,
	createEnum,
	integer,
	table,
	text,
} from '@alphatique/ducky/schema';

export const UserStatus = createEnum('user_status', ['active', 'inactive']);

export const user = table('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	status: _enum('status', UserStatus).notNull(),
});

export const post = table('post', {
	id: integer('id').primaryKey(),
	userId: integer('user_id').notNull(),
	title: text('title').notNull(),
	tags: text('tags').list().notNull(),
	content: text('content').notNull(),
});
