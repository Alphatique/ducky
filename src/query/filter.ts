import { type SqlArg, sql } from '~/sql';

export const eq = (left: SqlArg, right: SqlArg) => sql`${left} = ${right}`;
export const ne = (left: SqlArg, right: SqlArg) => sql`${left} != ${right}`;
export const gt = (left: SqlArg, right: SqlArg) => sql`${left} > ${right}`;
export const gte = (left: SqlArg, right: SqlArg) => sql`${left} >= ${right}`;
export const lt = (left: SqlArg, right: SqlArg) => sql`${left} < ${right}`;
export const lte = (left: SqlArg, right: SqlArg) => sql`${left} <= ${right}`;

export const and = (left: SqlArg, right: SqlArg) => sql`${left} AND ${right}`;
export const or = (left: SqlArg, right: SqlArg) => sql`${left} OR ${right}`;
export const not = (filter: SqlArg) => sql`NOT (${filter})`;
