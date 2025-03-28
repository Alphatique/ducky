import type { ArrayExactLength } from '~/utils';

import type { Enum } from './enum';
import type { JSONValue } from './json';

declare const internalTypeSymbol: unique symbol;

export interface DataType<T> {
	readonly [internalTypeSymbol]: T;
	readonly toString: () => string;
}

export function dataType<T>(name: string) {
	return {
		toString: () => name,
	} as DataType<T>;
}

export const bigint = dataType<bigint>('BIGINT');
export const boolean = dataType<boolean>('BOOLEAN');
export const date = dataType<Date>('DATE');
export const double = dataType<number>('DOUBLE');
export const float = dataType<number>('FLOAT');
export const integer = dataType<number>('INTEGER');
export const json = dataType<JSONValue>('JSON');
export const timestamptz = dataType<Date>('TIMESTAMPTZ');
export const timestamp = dataType<Date>('TIMESTAMP');
export const uuid = dataType<string>('UUID');
export const text = dataType<string>('TEXT');

export const list = <T>(element: DataType<T>) => dataType<T[]>(`${element}[]`);
export const array = <T, L extends number>(element: DataType<T>, length: L) =>
	dataType<ArrayExactLength<T, L>>(`${element}[${length}]`);

export const _enum = <T extends string>(_enum: Enum<T>) =>
	dataType<T>(_enum.name);
