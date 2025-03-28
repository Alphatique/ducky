import type { AnyColumn, InferColumnType } from './column';

export class Table<T extends Record<string, AnyColumn>> {
	constructor(
		public name: string,
		public columns: T,
	) {}
}

export type AnyTable = Table<Record<string, AnyColumn>>;

export type InferTableType<T extends AnyTable> = {
	[K in keyof T['columns']]: InferColumnType<T['columns'][K]>;
};

export function createTable<T extends Record<string, AnyColumn>>(
	name: string,
	columns: T,
): Table<T> {
	return new Table(name, columns);
}
