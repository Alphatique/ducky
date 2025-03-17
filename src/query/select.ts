import type * as duckdb from '@duckdb/duckdb-wasm';

import { query } from '~/query/query';
import { joinSql, sql } from '~/sql';
import type { AnyTable, InferTableType } from '~/types';
import type { Unwrap } from '~/utils';

import type { WhereClause } from './clause';
import * as filters from './filter';

export type SelectQuery<T extends AnyTable> = (
	options?: Partial<WhereClause<T>>,
) => Promise<Unwrap<InferTableType<T>>[]>;

export async function select<T extends AnyTable>(
	connection: duckdb.AsyncDuckDBConnection,
	table: T,
	options?: Partial<WhereClause<T>>,
): Promise<InferTableType<T>[]> {
	let q = sql`SELECT * FROM ${table}`;

	if (options?.where) {
		const condition = options.where(table.columns, {
			...filters,
			sql,
		});

		q = joinSql([q, sql`WHERE ${condition}`]);
	}

	return await query(connection, q);
}
