import type { JSONColumnType } from 'kysely';

import type { ArrayExactLength } from '../utils';

const dataTypeSymbol = Symbol('dataType');

export class DataType<T = unknown> {
	// @ts-expect-error
	readonly [dataTypeSymbol]: T;

	constructor(
		readonly name: string,
		readonly isEnumType: boolean,
	) {}
}

export function dataType<T>(name: string, isEnumType = false) {
	return new DataType<T>(name, isEnumType);
}

export const bigint = dataType<bigint>('BIGINT');
export const boolean = dataType<boolean>('BOOLEAN');
export const date = dataType<Date>('DATE');
export const double = dataType<number>('DOUBLE');
export const float = dataType<number>('FLOAT');
export const integer = dataType<number>('INTEGER');
export const timestamptz = dataType<Date>('TIMESTAMPTZ');
export const timestamp = dataType<Date>('TIMESTAMP');
export const uuid = dataType<string>('UUID');
export const text = dataType<string>('TEXT');

export const list = <T>(element: DataType<T>) =>
	dataType<T[]>(`${element.name}[]`);
export const array = <T, L extends number>(element: DataType<T>, length: L) =>
	dataType<ArrayExactLength<T, L>>(`${element.name}[${length}]`);

type JSONValue_ =
	| string
	| number
	| boolean
	| null
	| JSONValue_[]
	| { [key: string]: JSONValue_ };
export type JSONValue = null | JSONValue_[] | { [key: string]: JSONValue_ };

export const json = <T extends JSONValue = JSONValue>() =>
	dataType<JSONColumnType<T>>('JSON');
