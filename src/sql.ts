import { Column } from './schema/column';
import { Table } from './schema/table';
import type {
	AnyColumn,
	AnyTable,
	DataType,
	InferDataType,
} from './schema/types';

export type SqlArg =
	| Sql
	| AnyTable
	| AnyColumn
	| InferDataType<DataType>
	| null;

export class Sql {
	constructor(
		public readonly sql: string,
		public readonly placeholders: any[],
	) {}
}

export function sql(fragments: TemplateStringsArray, ...args: SqlArg[]): Sql {
	let sql = fragments[0];
	const placeholders = [];

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (arg instanceof Sql) {
			sql += arg.sql;
			placeholders.push(...arg.placeholders);
		} else if (arg instanceof Table) {
			sql += arg.name;
		} else if (arg instanceof Column) {
			sql += arg.name;
		} else {
			sql += '?';
			placeholders.push(arg);
		}

		sql += fragments[i + 1];
	}

	return new Sql(sql, placeholders);
}

export function joinSql(sql: Sql[], separator = ' '): Sql {
	return new Sql(
		sql.map(s => s.sql).join(separator),
		sql.flatMap(s => s.placeholders),
	);
}
