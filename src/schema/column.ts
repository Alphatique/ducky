import type { DataType } from './data-type';
import * as dataTypes from './data-type';
import type { Enum } from './data-type/enum';

export class Column<
	T,
	Nullable extends boolean,
	Unique extends boolean,
	PrimaryKey extends boolean,
> {
	constructor(
		public name: string,
		public type: DataType<T>,
		public isNullable: Nullable,
		public isUnique: Unique,
		public isPrimaryKey: PrimaryKey,
	) {}
}

export type AnyColumn = Column<any, boolean, boolean, boolean>;

export type IsNullable<C extends AnyColumn> = C extends Column<
	any,
	infer N extends boolean,
	boolean,
	infer P extends boolean
>
	? P extends true
		? false
		: N
	: never;

export type InferColumnType<C extends AnyColumn> = C extends Column<
	infer T,
	boolean,
	boolean,
	boolean
>
	? IsNullable<C> extends true
		? T | null
		: T
	: never;

export class ColumnBuilder<
	T,
	Nullable extends boolean,
	Unique extends boolean,
	PrimaryKey extends boolean,
> extends Column<T, Nullable, Unique, PrimaryKey> {
	static create<T>(name: string, type: DataType<T>) {
		return new ColumnBuilder(name, type, true, false, false);
	}

	public list() {
		if (this.type.toString().endsWith(']')) {
			throw new Error('Cannot nest arrays');
		}

		return new ColumnBuilder(
			this.name,
			dataTypes.list(this.type),
			this.isNullable,
			this.isUnique,
			this.isPrimaryKey,
		);
	}

	public array<L extends number>(length: L) {
		if (this.type.toString().endsWith(']')) {
			throw new Error('Cannot nest arrays');
		}

		return new ColumnBuilder(
			this.name,
			dataTypes.array(this.type, length),
			this.isNullable,
			this.isUnique,
			this.isPrimaryKey,
		);
	}

	public notNull() {
		return new ColumnBuilder(
			this.name,
			this.type,
			false,
			this.isUnique,
			this.isPrimaryKey,
		);
	}

	public unique() {
		return new ColumnBuilder(
			this.name,
			this.type,
			this.isNullable,
			true,
			this.isPrimaryKey,
		);
	}

	public primaryKey() {
		return new ColumnBuilder(
			this.name,
			this.type,
			this.isNullable,
			this.isUnique,
			true,
		);
	}
}

export function bigint(name: string) {
	return ColumnBuilder.create(name, dataTypes.bigint);
}
export function boolean(name: string) {
	return ColumnBuilder.create(name, dataTypes.boolean);
}
export function date(name: string) {
	return ColumnBuilder.create(name, dataTypes.date);
}
export function double(name: string) {
	return ColumnBuilder.create(name, dataTypes.double);
}
export function float(name: string) {
	return ColumnBuilder.create(name, dataTypes.float);
}
export function integer(name: string) {
	return ColumnBuilder.create(name, dataTypes.integer);
}
export function json(name: string) {
	return ColumnBuilder.create(name, dataTypes.json);
}
export function timestamptz(name: string) {
	return ColumnBuilder.create(name, dataTypes.timestamptz);
}
export function timestamp(name: string) {
	return ColumnBuilder.create(name, dataTypes.timestamp);
}
export function uuid(name: string) {
	return ColumnBuilder.create(name, dataTypes.uuid);
}
export function text(name: string) {
	return ColumnBuilder.create(name, dataTypes.text);
}

export function _enum<T extends string>(name: string, _enum: Enum<T>) {
	return ColumnBuilder.create(name, dataTypes._enum(_enum));
}
