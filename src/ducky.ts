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
import { Table } from './schema/table';
import type {
	AnyEnum,
	AnyTable,
	InferEnumType,
	InferTableType,
	Schema,
} from './schema/types';
import { type Sql, joinSql, joinSqlComma, rawSql, sql } from './sql';
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
	[K in keyof S]: S[K] extends AnyTable
		? Readonly<{
				$Infer: Unwrap<InferTableType<S[K]>>;
				$schema: S[K];
				select: SelectQuery<S[K]>;
				insert: InsertQuery<S[K]>;
				delete: DeleteQuery<S[K]>;
			}>
		: S[K] extends AnyEnum
			? Readonly<{
					$Infer: InferEnumType<S[K]>;
					$schema: S[K];
				}>
			: never;
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
				const [tableKey, method] = path;

				const tableOrEnum = options.schema[tableKey];
				if (!tableOrEnum) {
					throw new Error(`Table or enum ${tableKey} not found`);
				}

				if (tableOrEnum instanceof Table) {
					const table = tableOrEnum;

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
				} else {
					const _enum = tableOrEnum;

					switch (method) {
						case '$Infer': {
							throw new Error('$Infer is not callable');
						}
						case '$schema': {
							return _enum;
						}
						default: {
							throw new Error(`Method ${method} not found`);
						}
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
	const enumQueries = Object.values(schema)
		.filter(tableOrQuery => typeof tableOrQuery === 'function')
		.map(e => createEnumQuery(e));
	const tableQueries = Object.values(schema)
		.filter(tableOrQuery => tableOrQuery instanceof Table)
		.map(t => createTableQuery(t));

	await connection.query(enumQueries.concat(tableQueries).join('\n'));
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
		...table.constraints.map(
			c =>
				rawSql`${c.type} (${joinSqlComma(...c.columns.map(c => sql`${c}`))})`,
		),
	)});`;
}

function createEnumQuery(_enum: AnyEnum) {
	return rawSql`CREATE TYPE ${_enum._name} AS ENUM (${_enum._values.map(v => `'${v}'`).join(', ')});`;
}
