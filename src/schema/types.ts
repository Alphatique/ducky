export type { AnyColumn, Column, InferColumnType, IsNullable } from './column';
export type {
	ArrayDataType,
	DataType,
	InferDataType,
	ListDataType,
	ScalarDataType,
} from './data-type';
export type { AnyTable, InferTableType, Table } from './table';

import type { AnyColumn } from './column';
import type { Table } from './table';

export type Schema = Record<string, Table<Record<string, AnyColumn>>>;
