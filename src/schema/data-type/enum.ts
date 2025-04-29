import { dataType } from '.';
import { ColumnBuilder } from '../column';

export type Enum<T extends string> = {
	readonly _name: string;
	readonly _values: T[];
} & ((name: string) => ColumnBuilder<T, true, false, false>);

export type AnyEnum = Enum<string>;

export type InferEnumType<E extends AnyEnum> = E extends Enum<infer T>
	? T
	: never;

export function createEnum<T extends string>(
	name: string,
	values: T[],
): Enum<T> {
	return Object.assign(
		(_name: string) =>
			ColumnBuilder.create(_name, dataType<T>(name, 'UTF8')),
		{
			_name: name,
			_values: values,
		},
	);
}
