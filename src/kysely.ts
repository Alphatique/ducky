import type { Column, Schema, Table } from './schema';
import type { Pretty, UnionToIntersection } from './utils';

export type KyselySchema<S extends Schema> = Pretty<
	UnionToIntersection<
		{
			[T in keyof S]: S[T] extends Table
				? {
						[TN in S[T]['name']]: KyselyTable<S[T]>;
					}
				: never;
		}[keyof S]
	>
>;

export type KyselyTable<T extends Table> = Pretty<
	UnionToIntersection<
		{
			[K in keyof T['columns']]: T['columns'][K] extends Column<
				infer _,
				infer DT,
				infer NotNull,
				infer PrimaryKey
			>
				? {
						[N in T['columns'][K]['name']]: NotNull extends true
							? DT
							: PrimaryKey extends true
								? DT
								: DT | null;
					}
				: never;
		}[keyof T['columns']]
	>
>;
