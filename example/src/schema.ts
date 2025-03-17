import { integer, table, text } from '@alphatique/ducky/schema';

export const user = table('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	age: integer('age').notNull(),
});
