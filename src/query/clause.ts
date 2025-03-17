import type { AnyTable, InferTableType } from '~/schema/table';
import type { Sql, sql } from '~/sql';

import type * as _filters from './filter';

export type WhereClause<T extends AnyTable> = {
	where: (
		table: T['columns'],
		filters: typeof _filters & { sql: typeof sql },
	) => Sql;
};

export type ValuesClause<T extends AnyTable> = {
	values: InferTableType<T>[];
};
