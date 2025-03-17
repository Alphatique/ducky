export type { DataType, InferDataType } from './data-type';
export type { Column, AnyColumn, IsNullable, InferColumnType } from './column';
export type { Table, AnyTable, InferTableType } from './table';

import type { AnyColumn } from './column';
import type { Table } from './table';

export type Schema = Record<string, Table<Record<string, AnyColumn>>>;
