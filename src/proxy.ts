type Callback = (path: string[], args: any[]) => void;

export function createProxy(callback: Callback, path?: string[]) {
	return new Proxy(() => {}, {
		get(_obj, key) {
			if (typeof key !== 'string' || key === 'then') {
				return;
			}

			if (key.startsWith('$')) {
				return callback([...(path ?? []), key], []);
			}

			return createProxy(callback, [...(path ?? []), key]);
		},
		apply(_obj, _this, args) {
			return callback(path ?? [], args);
		},
	}) as any;
}
