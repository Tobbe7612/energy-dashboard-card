import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/card.ts",
  output: {
    file: "dist/energy-dashboard-card.js",
    format: "es",
    sourcemap: true
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" })
  ]
};