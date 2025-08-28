import * as duckdb from '@duckdb/duckdb-wasm';

import type { DuckyOptions } from './ducky';
import type { Schema } from './schema';

export async function initDuckDB(options: DuckyOptions<Schema>) {
	const bundle = await duckdb.selectBundle(
		options.bundles ?? duckdb.getJsDelivrBundles(),
	);
	let workerUrl: string | undefined;
	const worker = new Worker(
		options.bundles
			? bundle.mainWorker!
			: // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
				(workerUrl = URL.createObjectURL(
					new Blob([`importScripts("${bundle.mainWorker}");`], {
						type: 'text/javascript',
					}),
				)),
	);
	const logger =
		options.logger === 'console'
			? new duckdb.ConsoleLogger()
			: (options.logger ?? new duckdb.VoidLogger());

	const db = new duckdb.AsyncDuckDB(logger, worker);
	await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

	workerUrl && URL.revokeObjectURL(workerUrl);

	return db;
}
