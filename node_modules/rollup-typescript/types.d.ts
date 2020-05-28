declare module 'rollup-typescript' {
	import * as ts from 'typescript';

	export interface Options {
		tsconfig?: boolean;
		include?: string | string[];
		exclude?: string | string[];
		typescript?: typeof ts;
		module?: string;
	}

	export interface RollupPlugin {
		resolveId(importee: string, importer: string): any;
		load(id: string): string;
		transform(code: string, id: string): {
			code: string;
			map: any;
		};
	}

	export default function typescript(options?: Options): RollupPlugin
}
