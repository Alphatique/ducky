import type * as duckdb from '@duckdb/duckdb-wasm';

import type { Sql } from '~/sql';

export async function query(
	connection: duckdb.AsyncDuckDBConnection,
	sql: Sql,
) {
	if (sql.placeholders.length > 0) {
		const statement = await connection.prepare(sql.sql);
		const result = await statement.query(...sql.placeholders);
		statement.close();

		return result.toArray().map(row => row.toJSON());
	} else {
		const result = await connection.query(sql.sql);

		return result.toArray().map(row => row.toJSON());
	}
}
