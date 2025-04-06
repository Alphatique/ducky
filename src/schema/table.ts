import type { AnyColumn, InferColumnType } from './column';
import { type Constraint, primaryKey, unique } from './constraint';

export class Table<T extends Record<string, AnyColumn>> {
	constructor(
		public name: string,
		public columns: T,
		public constraints: Constraint[] = [],
	) {}
}

export type AnyTable = Table<Record<string, AnyColumn>>;

export type InferTableType<T extends AnyTable> = {
	[K in keyof T['columns']]: InferColumnType<T['columns'][K]>;
};

const _constraints = {
	primaryKey,
	unique,
};

type ConstraintFn<T extends AnyTable> = (
	table: T['columns'],
	constraints: typeof _constraints,
) => Constraint[];

export function createTable<T extends Record<string, AnyColumn>>(
	name: string,
	columns: T,
	constraintFn?: ConstraintFn<Table<T>>,
): Table<T> {
	return new Table(name, columns, constraintFn?.(columns, _constraints));
}
