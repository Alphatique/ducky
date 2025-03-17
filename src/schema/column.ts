import type { DataType, InferDataType } from './data-type';

export class Column<
	T extends DataType,
	Nullable extends boolean,
	Unique extends boolean,
	PrimaryKey extends boolean,
> {
	constructor(
		public name: string,
		public type: T,
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
		? InferDataType<T> | null
		: InferDataType<T>
	: never;

export class ColumnBuilder<
	T extends DataType,
	Nullable extends boolean,
	Unique extends boolean,
	PrimaryKey extends boolean,
> extends Column<T, Nullable, Unique, PrimaryKey> {
	static create<T extends DataType>(name: string, type: T) {
		return new ColumnBuilder(name, type, true, false, false);
	}

	public notNull() {
		const column = this as ColumnBuilder<T, false, Unique, PrimaryKey>;
		column.isNullable = false;
		return column;
	}

	public unique() {
		const column = this as ColumnBuilder<T, Nullable, true, PrimaryKey>;
		column.isUnique = true;
		return column;
	}

	public primaryKey() {
		const column = this as ColumnBuilder<T, Nullable, Unique, true>;
		column.isPrimaryKey = true;
		return column;
	}
}

export function bigint(name: string) {
	return ColumnBuilder.create(name, 'BIGINT');
}
export function boolean(name: string) {
	return ColumnBuilder.create(name, 'BOOLEAN');
}
export function date(name: string) {
	return ColumnBuilder.create(name, 'DATE');
}
export function double(name: string) {
	return ColumnBuilder.create(name, 'DOUBLE');
}
export function float(name: string) {
	return ColumnBuilder.create(name, 'FLOAT');
}
export function integer(name: string) {
	return ColumnBuilder.create(name, 'INTEGER');
}
export function json(name: string) {
	return ColumnBuilder.create(name, 'JSON');
}
export function timestamptz(name: string) {
	return ColumnBuilder.create(name, 'TIMESTAMPTZ');
}
export function timestamp(name: string) {
	return ColumnBuilder.create(name, 'TIMESTAMP');
}
export function uuid(name: string) {
	return ColumnBuilder.create(name, 'UUID');
}
export function text(name: string) {
	return ColumnBuilder.create(name, 'TEXT');
}
