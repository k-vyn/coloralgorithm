import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: [{ file: 'dist/bundle.d.ts', format: 'es' }],
    plugins: [dts()],
  }
];