import type * as duckdb from '@duckdb/duckdb-wasm';

import { query } from '~/query/query';
import { joinSql, sql } from '~/sql';
import type { AnyTable, InferTableType } from '~/types';
import type { Unwrap } from '~/utils';

import type { WhereClause } from './clause';
import * as filters from './filter';

export type DeleteQuery<T extends AnyTable> = <
	Returning extends boolean = false,
>(
	options?: Partial<WhereClause<T>> & { returning?: Returning },
) => Promise<Returning extends true ? Unwrap<InferTableType<T>>[] : void>;

export async function delete_<T extends AnyTable>(
	connection: duckdb.AsyncDuckDBConnection,
	table: T,
	options: Partial<WhereClause<T>> & { returning?: boolean },
): Promise<Unwrap<InferTableType<T>>[] | undefined> {
	let q = sql`DELETE FROM ${table}`;

	if (options?.where) {
		const condition = options.where(table.columns, {
			...filters,
			sql,
		});

		q = joinSql([q, sql`WHERE ${condition}`]);
	}

	if (options.returning) {
		q = joinSql([q, sql`RETURNING *`]);
	}

	return await query(connection, q);
}
