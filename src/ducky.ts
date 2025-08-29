import { DuckDbDialect } from '@coji/kysely-duckdb-wasm';
import * as duckdb from '@duckdb/duckdb-wasm';
import {
	CompiledQuery,
	type Insertable,
	Kysely,
	type Selectable,
	type Updateable,
} from 'kysely';

import { initDuckDB } from './duckdb';
import type { KyselySchema, KyselyTable } from './kysely';
import type { Enum, Schema } from './schema';
import { isEnum } from './schema/enum';
import { Table } from './schema/table';
import {
	type Pretty,
	type UnionToIntersection,
	doubleQuote,
	join,
	quote,
} from './utils';

export interface DuckyOptions<S extends Schema> {
	schema: S;
	bundles?: duckdb.DuckDBBundles;
	logger?: 'console' | duckdb.Logger;
}

type InferEnum<S extends Schema> = Pretty<
	UnionToIntersection<
		{
			[K in keyof S]: S[K] extends Enum
				? { [N in K]: S[K]['$values'][number] }
				: never;
		}[keyof S]
	>
>;
type InferSelectable<S extends Schema> = Pretty<
	UnionToIntersection<
		{
			[K in keyof S]: S[K] extends Table
				? { [N in K]: Selectable<KyselyTable<S[K]>> }
				: never;
		}[keyof S]
	>
>;
type InferInsertable<S extends Schema> = Pretty<
	UnionToIntersection<
		{
			[K in keyof S]: S[K] extends Table
				? { [N in K]: Insertable<KyselyTable<S[K]>> }
				: never;
		}[keyof S]
	>
>;
type InferUpdateable<S extends Schema> = Pretty<
	UnionToIntersection<
		{
			[K in keyof S]: S[K] extends Table
				? { [N in K]: Updateable<KyselyTable<S[K]>> }
				: never;
		}[keyof S]
	>
>;

type InsertBlob<S extends Schema> = <T extends keyof KyselySchema<S> & string>(
	table: T,
	type: 'json' | 'csv' | 'parquet',
	files: File[],
) => Promise<void>;

export type Ducky<S extends Schema> = Kysely<KyselySchema<S>> & {
	$schema: S;
	$db: Promise<duckdb.AsyncDuckDB>;
	$kyselySchema: KyselySchema<S>;
	$inferEnum: InferEnum<S>;
	$inferSelectable: InferSelectable<S>;
	$inferInsertable: InferInsertable<S>;
	$inferUpdateable: InferUpdateable<S>;

	insertBlob: InsertBlob<S>;
};

export function createDucky<S extends Schema>(
	options: DuckyOptions<S>,
): Ducky<S> {
	const dbPromise = initDuckDB(options);

	const dialect = new DuckDbDialect({
		database: async () => {
			const db = await dbPromise;

			await applySchema(db, options.schema);

			return db;
		},
		tableMappings: {},
	});

	const ducky = new Kysely<KyselySchema<S>>({
		dialect,
		log: options.logger === 'console' ? ['query', 'error'] : undefined,
	}) as Ducky<S>;

	ducky.$db = dbPromise;
	ducky.$schema = options.schema;

	ducky.insertBlob = async (table, type, files) => {
		const db = await dbPromise;
		const id = crypto.randomUUID();

		await Promise.all(
			files.map(async (file, i) =>
				db.registerFileHandle(
					`${id}-${i}`,
					file,
					duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
					true,
				),
			),
		);

		await ducky.executeQuery(
			CompiledQuery.raw(
				`INSERT INTO ${doubleQuote(table)} SELECT * FROM read_${type}('${id}-*');`,
			),
		);

		await Promise.all(files.map((_, i) => db.dropFile(`${id}-${i}`)));
	};

	return ducky;
}

async function applySchema(db: duckdb.AsyncDuckDB, schema: Schema) {
	const createEnumQueries = Object.values(schema)
		.filter(isEnum)
		.map(createEnumQuery);
	const createTableQueries = Object.values(schema)
		.filter((table): table is Table => table instanceof Table)
		.map(createTableQuery);
	const query = join('\n', [...createEnumQueries, ...createTableQueries]);

	const connection = await db.connect();
	await connection.query(query);
	connection.close();
}

function createTableQuery(table: Table) {
	return join(' ', [
		'CREATE TABLE',
		doubleQuote(table.name),
		'(',
		join(
			', ',
			Object.values(table.columns)
				.map(column =>
					join(' ', [
						doubleQuote(column.name),
						column.type.name,
						column.isNotNull && 'NOT NULL',
						column.isPrimaryKey && 'PRIMARY KEY',
						column.isUnique && 'UNIQUE',
					]),
				)
				.concat(
					table.constraints.map(constraint =>
						join(' ', [
							constraint.type,
							'(',
							join(
								', ',
								constraint.columns.map(column =>
									doubleQuote(column.name),
								),
							),
							')',
						]),
					),
				),
		),
		');',
	]);
}

function createEnumQuery(_enum: Enum) {
	return join(' ', [
		'CREATE TYPE',
		doubleQuote(_enum.$name),
		'AS ENUM (',
		join(
			', ',
			_enum.$values.map(value => quote(value)),
		),
		');',
	]);
}
