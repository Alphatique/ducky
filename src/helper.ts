import { type Expression, sql } from 'kysely';

export function nullIf<T>(value: Expression<T>, nullValue: Expression<T>) {
	return sql<T | null>`nullif(${value}, ${nullValue})`;
}

export function lower<T extends string | null>(v: Expression<T>) {
	return sql<T extends null ? string | null : string>`lower(${v})`;
}
export function upper<T extends string | null>(v: Expression<T>) {
	return sql<T extends null ? string | null : string>`upper(${v})`;
}

export function floor<T extends number | null>(v: Expression<T>) {
	return sql<T extends null ? number | null : number>`floor(${v})`;
}

export function ceil<T extends number | null>(v: Expression<T>) {
	return sql<T extends null ? number | null : number>`ceil(${v})`;
}
export function round<T extends number | null>(v: Expression<T>, s: number) {
	return sql<
		T extends null ? number | null : number
	>`round(${v}, ${sql.raw(s.toString())})`;
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
