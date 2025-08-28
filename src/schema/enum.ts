import { ColumnBuilder } from './column';
import { dataType } from './data-types';

const enumSymbol = Symbol('enum');

export type Enum<T extends string = string> = {
	readonly [enumSymbol]: true;
	readonly $name: string;
	readonly $values: T[];
} & (<N extends string>(name: N) => ColumnBuilder<N, T, false, false, false>);

export function createEnum<T extends string>(
	name: string,
	values: T[],
): Enum<T> {
	return Object.assign(
		<N extends string>(_name: N) =>
			ColumnBuilder.create(_name, dataType<T>(name, true)),
		{
			[enumSymbol]: true as const,
			$name: name,
			$values: values,
		},
	);
}

export function isEnum(value: unknown): value is Enum {
	return typeof value === 'function' && enumSymbol in value;
}
