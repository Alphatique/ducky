import { Column } from './schema/column';
import { Table } from './schema/table';

export class Sql {
	constructor(
		public readonly sql: string,
		public readonly placeholders: any[],
	) {}

	toString() {
		return this.sql;
	}
}

export function sql(fragments: TemplateStringsArray, ...args: any[]): Sql {
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

export function rawSql(fragments: TemplateStringsArray, ...args: any[]) {
	let sql = fragments[0];

	for (let i = 0; i < args.length; i++) {
		sql += args[i];
		sql += fragments[i + 1];
	}

	return new Sql(sql, []);
}

export function joinSql(...sql: (Sql | false | undefined)[]): Sql {
	const _sql = sql.filter((s): s is Sql => Boolean(s));

	return new Sql(
		_sql.map(s => s.sql).join(' '),
		_sql.flatMap(s => s.placeholders),
	);
}

export function joinSqlComma(...sql: (Sql | false | undefined)[]): Sql {
	const _sql = sql.filter((s): s is Sql => Boolean(s));

	return new Sql(
		_sql.map(s => s.sql).join(', '),
		_sql.flatMap(s => s.placeholders),
	);
}
