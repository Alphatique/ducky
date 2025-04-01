import type {
	AnyEnum,
	AnyTable,
	InferEnumType,
	InferTableType,
} from './schema/types';

export type Infer<T> = T extends AnyTable
	? InferTableType<T>
	: T extends AnyEnum
		? InferEnumType<T>
		: never;
