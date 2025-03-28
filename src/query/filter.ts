import { sql } from '~/sql';

export const eq = (left: any, right: any) => sql`${left} = ${right}`;
export const ne = (left: any, right: any) => sql`${left} != ${right}`;
export const gt = (left: any, right: any) => sql`${left} > ${right}`;
export const gte = (left: any, right: any) => sql`${left} >= ${right}`;
export const lt = (left: any, right: any) => sql`${left} < ${right}`;
export const lte = (left: any, right: any) => sql`${left} <= ${right}`;

export const and = (left: any, right: any) => sql`${left} AND ${right}`;
export const or = (left: any, right: any) => sql`${left} OR ${right}`;
export const not = (filter: any) => sql`NOT (${filter})`;
