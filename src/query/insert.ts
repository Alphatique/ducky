import type * as duckdb from '@duckdb/duckdb-wasm';

import { query } from '~/query/query';
import { joinSql, sql } from '~/sql';
import type { AnyTable, InferTableType } from '~/types';
import type { Unwrap } from '~/utils';

import type { ValuesClause } from './clause';

export type InsertQuery<T extends AnyTable> = <
	Returning extends boolean = false,
>(
	options: ValuesClause<T> & { returning?: Returning },
) => Promise<Returning extends true ? Unwrap<InferTableType<T>>[] : void>;

export async function insert<T extends AnyTable>(
	connection: duckdb.AsyncDuckDBConnection,
	table: T,
	options: ValuesClause<T> & { returning?: boolean },
): Promise<Unwrap<InferTableType<T>>[] | undefined> {
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

	let q = sql`INSERT INTO ${table} VALUES ${values}`;

	if (options.returning) {
		q = joinSql([q, sql`RETURNING *`]);
	}

	return await query(connection, q);
}
