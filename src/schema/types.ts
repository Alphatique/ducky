export type { AnyColumn, Column, InferColumnType, IsNullable } from './column';
export type { DataType } from './data-type';
export type { AnyTable, InferTableType, Table } from './table';
export type { AnyEnum, Enum, InferEnumType } from './data-type/enum';

import type { AnyColumn } from './column';
import type { AnyEnum } from './data-type/enum';
import type { Table } from './table';

export type Schema = Record<string, Table<Record<string, AnyColumn>> | AnyEnum>;
