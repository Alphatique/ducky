import type { ArrayExactLength } from '~/utils';

export type ScalarDataType =
	| 'BIGINT'
	| 'BOOLEAN'
	| 'DATE'
	| 'DOUBLE'
	| 'FLOAT'
	| 'INTEGER'
	| 'JSON'
	| 'TIMESTAMPTZ'
	| 'TIMESTAMP'
	| 'UUID'
	| 'TEXT';

export type ListDataType<T extends ScalarDataType> = `${T}[]`;
export type ArrayDataType<
	T extends ScalarDataType,
	L extends number,
> = `${T}[${L}]`;

export type DataType =
	| ScalarDataType
	| ListDataType<ScalarDataType>
	| ArrayDataType<ScalarDataType, number>;

interface TypeMap {
	BIGINT: bigint;
	BOOLEAN: boolean;
	DATE: Date;
	DOUBLE: number;
	FLOAT: number;
	INTEGER: number;
	JSON: object;
	TIMESTAMPTZ: Date;
	TIMESTAMP: Date;
	UUID: string;
	TEXT: string;
}

export type InferDataType<T extends DataType> = T extends ScalarDataType
	? TypeMap[T]
	: T extends ListDataType<infer E>
		? InferDataType<E>[]
		: T extends ArrayDataType<infer E, infer L>
			? ArrayExactLength<InferDataType<E>, L>
			: never;
