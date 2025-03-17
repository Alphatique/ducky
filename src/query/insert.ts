import * as duckdb from '@duckdb/duckdb-wasm';
import { nanoid } from 'nanoid';

import { query } from '~/query/query';
import { joinSql, rawSql, sql } from '~/sql';
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
	let q = sql`INSERT INTO ${table}`;

	if ('values' in options) {
		const values = joinSql(
			options.values.map(
				v =>
					sql`(${joinSql(
						Object.keys(table.columns).map(
							key => sql`${v[key] ?? null}`,
						),
						', ',
					)})`,
			),
			', ',
		);

		q = joinSql([q, sql`VALUES ${values}`]);
	} else {
		const id = nanoid();

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

		q = joinSql([q, rawSql`SELECT * FROM read_${options.type}('${id}-*')`]);
	}

	if (options.returning) {
		q = joinSql([q, sql`RETURNING *`]);
	}

	return await query(connection, q);
}
