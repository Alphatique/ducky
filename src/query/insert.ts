import * as duckdb from '@duckdb/duckdb-wasm';

import { query } from '~/query/query';
import { joinSql, joinSqlComma, rawSql, sql } from '~/sql';
import type { AnyTable, InferTableType } from '~/types';
import type { Unwrap } from '~/utils';

import type { ValuesClause } from './clause';

export type InsertQuery<T extends AnyTable> = <
	Returning extends boolean = false,
>(
	options: ValuesClause<T> & { returning?: Returning },
) => Promise<Returning extends true ? Unwrap<InferTableType<T>>[] : void>;

export async function insert<T extends AnyTable>(
	db: duckdb.AsyncDuckDB,
	connection: duckdb.AsyncDuckDBConnection,
	table: T,
	options: ValuesClause<T> & { returning?: boolean },
): Promise<Unwrap<InferTableType<T>>[] | undefined> {
	if ('values' in options) {
		const values = joinSqlComma(
			...options.values.map(
				v =>
					sql`(${joinSqlComma(
						...Object.entries(table.columns).map(([key, column]) =>
							column.type.endsWith(']') && Array.isArray(v[key])
								? sql`[${joinSqlComma(...v[key].map(e => sql`${e ?? null}`))}]`
								: sql`${v[key] ?? null}`,
						),
					)})`,
			),
		);

		return await query(
			connection,
			joinSql(
				sql`INSERT INTO ${table} VALUES ${values}`,
				options.returning && sql`RETURNING *`,
			),
		);
	} else {
		const id = crypto.randomUUID();

		await Promise.all(
			options.files.map((file, i) => {
				const name = `${id}-${i}`;
				switch (options.protocol) {
					case duckdb.DuckDBDataProtocol.BROWSER_FILEREADER:
					case duckdb.DuckDBDataProtocol.BROWSER_FSACCESS: {
						return db.registerFileHandle(
							name,
							file,
							options.protocol,
							true,
						);
					}
					case duckdb.DuckDBDataProtocol.BUFFER: {
						return db.registerFileBuffer(name, file);
					}
					case duckdb.DuckDBDataProtocol.HTTP:
					case duckdb.DuckDBDataProtocol.S3: {
						return db.registerFileURL(
							name,
							file,
							options.protocol,
							true,
						);
					}
					default: {
						throw new Error(
							`Unsupported protocol: ${duckdb.DuckDBDataProtocol[options.protocol]}`,
						);
					}
				}
			}),
		);

		return await query(
			connection,
			joinSql(
				sql`INSERT INTO ${table}`,
				rawSql`SELECT * FROM read_${options.type}('${id}-*')`,
				options.returning && sql`RETURNING *`,
			),
		);
	}
}
