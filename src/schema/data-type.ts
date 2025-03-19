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

export type ArrayDataType<T extends ScalarDataType> = `${T}[]`;

export type DataType = ScalarDataType | ArrayDataType<ScalarDataType>;

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
	: T extends ArrayDataType<infer E>
		? InferDataType<E>[]
		: never;
