export type DataType =
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

export type InferDataType<T extends DataType> = TypeMap[T];
