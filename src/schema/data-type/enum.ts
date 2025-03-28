export class Enum<T extends string> {
	constructor(
		public readonly name: string,
		public readonly values: T[],
	) {}
}

export type AnyEnum = Enum<string>;

export type InferEnumType<E extends AnyEnum> = E extends Enum<infer T>
	? T
	: never;

export function createEnum<T extends string>(name: string, values: T[]) {
	return new Enum(name, values);
}
