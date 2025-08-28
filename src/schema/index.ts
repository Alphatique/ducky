export type { DataType } from './data-types';

export {
	type Column,
	bigint,
	boolean,
	date,
	double,
	float,
	integer,
	json,
	text,
	timestamp,
	timestamptz,
	uuid,
} from './column';

export { type Enum, createEnum } from './enum';

export { type Table, createTable } from './table';

import type { Enum } from './enum';
import type { Table } from './table';

export type Schema = Record<string, Table | Enum>;
