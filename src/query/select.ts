import type * as duckdb from '@duckdb/duckdb-wasm';

import { query } from '~/query/query';
import type { AnyTable, InferTableType } from '~/schema/types';
import { joinSql, sql } from '~/sql';
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
	return await query(
		connection,
		joinSql(
			sql`SELECT * FROM ${table}`,
			options?.where &&
				sql`WHERE ${options.where(table.columns, {
					...filters,
					sql,
				})}`,
		),
	);
}
