import * as duckdb from '@duckdb/duckdb-wasm';

import { createProxy } from './proxy';
import {
	type DeleteQuery,
	type InsertQuery,
	type SelectQuery,
	delete_,
	insert,
	query,
	select,
} from './query';
import type { AnyTable, InferTableType, Schema } from './schema/types';
import { type Sql, joinSql, joinSqlComma, rawSql } from './sql';
import type { Unwrap } from './utils';

export interface DuckyOptions<S extends Schema> {
	schema: S;
	bundles: duckdb.DuckDBBundles;
	logger?: 'console' | duckdb.Logger;
}

export type Ducky<S extends Schema> = {
	readonly $db: Promise<duckdb.AsyncDuckDB>;
	readonly $connection: Promise<duckdb.AsyncDuckDBConnection>;
	readonly $query: (sql: Sql) => Promise<any[]>;
} & {
	[K in keyof S]: Readonly<{
		$Infer: Unwrap<InferTableType<S[K]>>;
		$schema: S[K];
		select: SelectQuery<S[K]>;
		insert: InsertQuery<S[K]>;
		delete: DeleteQuery<S[K]>;
	}>;
};

export function createDucky<S extends Schema>(
	options: DuckyOptions<S>,
): Ducky<S> {
	const initPromise = initDuckDB(options);

	const $query = (sql: Sql) =>
		initPromise.then(({ connection }) => query(connection, sql));

	return createProxy((path, args) => {
		switch (path.length) {
			case 1: {
				const [method] = path;

				switch (method) {
					case '$db': {
						return initPromise.then(({ db }) => db);
					}
					case '$connection': {
						return initPromise.then(({ connection }) => connection);
					}
					case '$query': {
						return $query;
					}
					default: {
						throw new Error(`Method ${method} not found`);
					}
				}
			}
			case 2: {
				const [_table, method] = path;

				const table = options.schema[_table];
				if (!table) {
					throw new Error(`Table ${_table} not found`);
				}

				switch (method) {
					case '$Infer': {
						throw new Error('$Infer is not callable');
					}
					case '$schema': {
						return table;
					}
					case 'select': {
						return initPromise.then(({ connection }) =>
							select(connection, table, args[0]),
						);
					}
					case 'insert': {
						return initPromise.then(({ db, connection }) =>
							insert(db, connection, table, args[0]),
						);
					}
					case 'delete': {
						return initPromise.then(({ connection }) =>
							delete_(connection, table, args[0]),
						);
					}
					default: {
						throw new Error(`Method ${method} not found`);
					}
				}
			}
			default: {
				throw new Error('Invalid path');
			}
		}
	}) as Ducky<S>;
}

async function initDuckDB(options: DuckyOptions<any>) {
	const bundle = await duckdb.selectBundle(options.bundles);
	const worker = new Worker(bundle.mainWorker!);
	const logger =
		options.logger === 'console'
			? new duckdb.ConsoleLogger()
			: (options.logger ?? new duckdb.VoidLogger());

	const db = new duckdb.AsyncDuckDB(logger, worker);
	await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

	const connection = await db.connect();

	await applySchema(connection, options.schema);

	return { db, connection };
}

async function applySchema(
	connection: duckdb.AsyncDuckDBConnection,
	schema: Schema,
) {
	const queries = Object.values(schema).map(table => createTableQuery(table));

	await connection.query(queries.join('\n'));
}

function createTableQuery(table: AnyTable) {
	return rawSql`CREATE TABLE ${table.name} (${joinSqlComma(
		...Object.values(table.columns).map(c =>
			joinSql(
				rawSql`${c.name} ${c.type}`,
				!c.isNullable && rawSql`NOT NULL`,
				c.isUnique && rawSql`UNIQUE`,
				c.isPrimaryKey && rawSql`PRIMARY KEY`,
			),
		),
	)});`;
}
