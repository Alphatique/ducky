export type Unwrap<T> = {
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
