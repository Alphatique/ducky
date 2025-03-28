import {
	_enum,
	createEnum,
	createTable,
	integer,
	text,
} from '@alphatique/ducky/schema';

export const UserStatus = createEnum('user_status', ['active', 'inactive']);

export const user = createTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	status: _enum('status', UserStatus).notNull(),
});

export const post = createTable('post', {
	id: integer('id').primaryKey(),
	userId: integer('user_id').notNull(),
	title: text('title').notNull(),
	tags: text('tags').list().notNull(),
	content: text('content').notNull(),
});
