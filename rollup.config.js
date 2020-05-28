import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/main.ts",
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
