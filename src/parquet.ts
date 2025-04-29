import type { AnyTable } from './schema/table';

export function generateParquetSchema(table: AnyTable) {
	return Object.fromEntries(
		Object.entries(table.columns).map(([key, column]) => {
			const type = column.type.toParquetType();
			const optional = !column.isPrimaryKey && column.isNullable;

			if (!type) {
				throw new Error(`Parquet type not supported for column ${key}`);
			}

			return [
				key,
				{
					type,
					optional,
				},
			];
		}),
	);
}
