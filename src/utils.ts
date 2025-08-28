export type Pretty<T> = {
	[K in keyof T]: T[K];
} & {};

export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never;

export type ArrayExactLength<T, L extends number> = ArrayExactLengthRec<
	T,
	L,
	[]
>;

type ArrayExactLengthRec<
	T,
	L extends number,
	R extends T[],
> = R['length'] extends L ? R : ArrayExactLengthRec<T, L, [T, ...R]>;

export function quote(value: string): string {
	return `'${value}'`;
}

export function doubleQuote(value: string): string {
	return `"${value}"`;
}

export function join(
	delimiter: string,
	items: (string | false | undefined | null)[],
): string {
	return items.filter(Boolean).join(delimiter);
}
