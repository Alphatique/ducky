import type { AnyColumn } from './column';

export interface Constraint {
	type: 'PRIMARY KEY' | 'UNIQUE';
	columns: AnyColumn[];
}

export function primaryKey(columns: AnyColumn[]): Constraint {
	return {
		type: 'PRIMARY KEY',
		columns,
	};
}

export function unique(columns: AnyColumn[]): Constraint {
	return {
		type: 'UNIQUE',
		columns,
	};
}
