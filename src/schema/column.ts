import { type DataType, type JSONValue, array, list } from './data-types';
import * as dataTypes from './data-types';

export class Column<
	N extends string = string,
	T = unknown,
	NotNull extends boolean = boolean,
	PrimaryKey extends boolean = boolean,
	Unique extends boolean = boolean,
> {
	constructor(
		readonly name: N,
		readonly type: DataType<T>,
		readonly isNotNull: NotNull,
		readonly isPrimaryKey: PrimaryKey,
		readonly isUnique: Unique,
	) {}
}

export class ColumnBuilder<
	N extends string,
	T,
	NotNull extends boolean,
	PrimaryKey extends boolean,
	Unique extends boolean,
> extends Column<N, T, NotNull, PrimaryKey, Unique> {
	static create<N extends string, T>(name: N, type: DataType<T>) {
		return new ColumnBuilder(name, type, false, false, false);
	}

	public list() {
		return new ColumnBuilder(
			this.name,
			list(this.type),
			this.isNotNull,
			this.isPrimaryKey,
			this.isUnique,
		);
	}

	public array<L extends number>(length: L) {
		return new ColumnBuilder(
			this.name,
			array<T, L>(this.type, length),
			this.isNotNull,
			this.isPrimaryKey,
			this.isUnique,
		);
	}

	public notNull() {
		return new ColumnBuilder(
			this.name,
			this.type,
			true,
			this.isPrimaryKey,
			this.isUnique,
		);
	}

	public primaryKey() {
		return new ColumnBuilder(
			this.name,
			this.type,
			this.isNotNull,
			true,
			this.isUnique,
		);
	}

	public unique() {
		return new ColumnBuilder(
			this.name,
			this.type,
			this.isNotNull,
			this.isPrimaryKey,
			true,
		);
	}
}

export function bigint<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.bigint);
}
export function boolean<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.boolean);
}
export function date<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.date);
}
export function double<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.double);
}
export function float<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.float);
}
export function integer<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.integer);
}
export function json<T extends JSONValue, N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.json<T>());
}
export function timestamptz<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.timestamptz);
}
export function timestamp<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.timestamp);
}
export function uuid<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.uuid);
}
export function text<N extends string>(name: N) {
	return ColumnBuilder.create(name, dataTypes.text);
}
