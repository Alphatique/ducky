import { type Expression, sql } from 'kysely';

export function nullIf<T>(value: Expression<T>, nullValue: Expression<T>) {
	return sql<T | null>`nullif(${value}, ${nullValue})`;
}

export function lower(value: Expression<string | null>) {
	return sql<string | null>`lower(${value})`;
}
export function upper(value: Expression<string | null>) {
	return sql<string | null>`upper(${value})`;
}

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

export function dateTrunc(part: Precision, date: Expression<Date>) {
	return sql<Date>`date_trunc('${sql.raw(part)}', ${date})`;
}

export function strftime(date: Expression<Date>, format: string) {
	return sql<string>`strftime(${date}, '${sql.raw(format)}')`;
}
