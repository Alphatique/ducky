import type { Column } from './column';

export interface Constraint {
	type: 'PRIMARY KEY' | 'UNIQUE';
	columns: Column[];
}

export function primaryKey(columns: Column[]): Constraint {
	return {
		type: 'PRIMARY KEY',
		columns,
	};
}

export function unique(columns: Column[]): Constraint {
	return {
		type: 'UNIQUE',
		columns,
	};
}
