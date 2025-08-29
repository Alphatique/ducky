import { sql } from 'kysely';

export type Precision =
	| 'century'
	| 'day'
	| 'decade'
	| 'hour'
	| 'microseconds'
	| 'millennium'
	| 'milliseconds'
	| 'minute'
	| 'month'
	| 'quarter'
	| 'second'
	| 'week'
	| 'year';

export function dateTrunc(part: Precision, date: unknown) {
	return sql<Date>`date_trunc('${part}', ${date})`;
}

export function nullIf<T = unknown>(value: unknown, nullValue: unknown) {
	return sql<T>`NULLIF(${value}, ${nullValue})`;
}
