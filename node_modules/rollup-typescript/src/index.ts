import * as ts from 'typescript';
import * as fs from 'fs';
import { createFilter } from 'rollup-pluginutils';
import { endsWith } from './string';

import { getDefaultOptions, compilerOptionsFromTsConfig, adjustCompilerOptions } from './options';
import * as resolveHost from './resolveHost';

interface Options {
	tsconfig?: boolean;
	include?: string | string[];
	exclude?: string | string[];
	typescript?: typeof ts;
	module?: string;
	target?: string;
}

interface RollupPlugin {
	resolveId(importee: string, importer: string): any;
	load(id: string): undefined | string;
	transform(code: string, id: string): null | {
		code: string;
		map: any;
	};
}

// The injected id for helpers.
const TSLIB = 'tslib';
let tslibSource: string;

try {
	const tslibPath = require.resolve('tslib/' + require('tslib/package.json')['module']);
	tslibSource = fs.readFileSync(tslibPath, 'utf8');
} catch (e) {
	console.warn('Error loading `tslib` helper library.');
	throw e;
}

typescript['default'] = typescript;
export default typescript;

function typescript({...options}: Options): RollupPlugin {

	const filter = createFilter(
		options.include || [ '*.ts+(|x)', '**/*.ts+(|x)' ],
		options.exclude || [ '*.d.ts', '**/*.d.ts' ] );

	delete options.include;
	delete options.exclude;

	// Allow users to override the TypeScript version used for transpilation.
	const typescript: typeof ts = options.typescript || ts;

	delete options.typescript;

	// Load options from `tsconfig.json` unless explicitly asked not to.
	const tsconfig = options.tsconfig === false ? {} :
		compilerOptionsFromTsConfig( typescript );

	delete options.tsconfig;

	// Since the CompilerOptions aren't designed for the Rollup
	// use case, we'll adjust them for use with Rollup.
	adjustCompilerOptions(typescript, tsconfig);
	adjustCompilerOptions(typescript, options);

	// Merge all options.
	options = { ...tsconfig, ...getDefaultOptions(), ...options };

	// Verify that we're targeting ES2015 modules.
	if (options.module !== 'es2015' && options.module !== 'es6') {
		throw new Error(`rollup-typescript: The module kind should be 'es2015', found: '${ options.module }'`);
	}

	const parsed = typescript.convertCompilerOptionsFromJson(options, process.cwd());

	if (parsed.errors.length) {
		for (const error of parsed.errors) {
			console.error(`rollup-typescript: ${error.messageText}`);
		}

		throw new Error(`rollup-typescript: Couldn’t process compiler options`);
	}

	const compilerOptions = parsed.options;

	return {
		resolveId(importee: string, importer: string) {
			if (importee === TSLIB) {
				return '\0' + TSLIB;
			}

			if (!importer) return null;

			let result;

			importer = importer.split('\\').join('/');

			result = typescript.nodeModuleNameResolver(importee, importer, compilerOptions, resolveHost);

			if (result.resolvedModule && result.resolvedModule.resolvedFileName) {
				if (endsWith(result.resolvedModule.resolvedFileName, '.d.ts')) {
					return null;
				}

				return result.resolvedModule.resolvedFileName;
			}

			return null;
		},

		load(id: string) {
			if (id === '\0' + TSLIB) {
				return tslibSource;
			}
		},

		transform(code: string, id: string) {
			if (!filter(id)) return null;

			const transformed = typescript.transpileModule(code, {
				fileName: id,
				reportDiagnostics: true,
				compilerOptions,
			});

			const diagnostics = transformed.diagnostics || [];

			let fatalError = false;

			for (const diagnostic of diagnostics) {
				const message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

				if (diagnostic.file) {
					const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);

					console.error(`${diagnostic.file.fileName}(${line + 1},${character + 1}): error TS${diagnostic.code}: ${message}`);
				} else {
					console.error(`Error: ${message}`);
				}

				if (diagnostic.category === ts.DiagnosticCategory.Error) {
					fatalError = true;
				}
			}

			if (fatalError) {
				throw new Error(`There were TypeScript errors transpiling.`);
			}

			return {
				// Always append an import for the helpers.
				code: transformed.outputText,

				// Rollup expects `map` to be an object so we must parse the string
				map: transformed.sourceMapText ? JSON.parse(transformed.sourceMapText) : null,
			};
		}
	};
}
