import type { Table } from './schema';

const parquetTypeMap: Record<string, string> = {
	BIGINT: 'INT64',
	BOOLEAN: 'BOOLEAN',
	DATE: 'DATE',
	DOUBLE: 'DOUBLE',
	FLOAT: 'FLOAT',
	INTEGER: 'INT32',
	JSON: 'JSON',
	TIMESTAMPTZ: 'TIMESTAMP_MILLIS',
	TIMESTAMP: 'TIMESTAMP_MILLIS',
	UUID: 'UUID',
	TEXT: 'UTF8',
};

export function generateParquetSchema(table: Table) {
	return Object.fromEntries(
		Object.values(table.columns).map(column => {
			const type = column.type.isEnumType
				? 'UTF8'
				: parquetTypeMap[column.type.name];
			const optional = !(column.isNotNull || column.isPrimaryKey);

			if (!type) {
				throw new Error(`Unsupported column type: ${column.type.name}`);
			}

			return [column.name, { type, optional }];
		}),
	);
}
