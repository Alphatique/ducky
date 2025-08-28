import type { DataType, Schema, Table } from './schema';
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
			[K in keyof T['columns']]: T['columns'][K]['type'] extends DataType<
				infer DT
			>
				? {
						[N in T['columns'][K]['name']]: DT;
					}
				: never;
		}[keyof T['columns']]
	>
>;
