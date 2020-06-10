import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "index.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
    }),
  ],
};
