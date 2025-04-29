import type { ArrayExactLength } from '~/utils';
import type { JSONValue } from './json';

const internalTypeSymbol: unique symbol = Symbol('internalType');

export class DataType<T> {
	// @ts-expect-error
	readonly [internalTypeSymbol]: T;

	constructor(
		readonly name: string,
		readonly parquetType?: string,
	) {}

	public toString() {
		return this.name;
	}

	public toParquetType() {
		return this.parquetType;
	}
}

export function dataType<T>(name: string, parquetType?: string) {
	return new DataType<T>(name, parquetType);
}

export const bigint = dataType<bigint>('BIGINT', 'INT64');
export const boolean = dataType<boolean>('BOOLEAN', 'BOOLEAN');
export const date = dataType<Date>('DATE', 'DATE');
export const double = dataType<number>('DOUBLE', 'DOUBLE');
export const float = dataType<number>('FLOAT', 'FLOAT');
export const integer = dataType<number>('INTEGER', 'INT32');
export const json = dataType<JSONValue>('JSON', 'JSON');
export const timestamptz = dataType<Date>('TIMESTAMPTZ', 'TIMESTAMP_MILLIS');
export const timestamp = dataType<Date>('TIMESTAMP', 'TIMESTAMP_MILLIS');
export const uuid = dataType<string>('UUID', 'UUID');
export const text = dataType<string>('TEXT', 'UTF8');

export const list = <T>(element: DataType<T>) => dataType<T[]>(`${element}[]`);
export const array = <T, L extends number>(element: DataType<T>, length: L) =>
	dataType<ArrayExactLength<T, L>>(`${element}[${length}]`);
