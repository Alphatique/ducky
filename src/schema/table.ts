import type { Column } from './column';
import { type Constraint, primaryKey, unique } from './constraint';

export class Table<
	N extends string = string,
	T extends Record<string, Column> = Record<string, Column>,
> {
	constructor(
		readonly name: N,
		readonly columns: T,
		readonly constraints: Constraint[],
	) {}
}

const _constraints = {
	primaryKey,
	unique,
};

export function createTable<N extends string, T extends Record<string, Column>>(
	name: N,
	columns: T,
	constraintsFn?: (
		columns: T,
		constraints: typeof _constraints,
	) => Constraint[],
) {
	return new Table(
		name,
		columns,
		constraintsFn?.(columns, _constraints) ?? [],
	);
}
