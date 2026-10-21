import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const sdPlugin = "com.vttdeck.foundry.sdPlugin";

export default {
	input: "src/plugin.js",
	output: {
		file: `${sdPlugin}/bin/plugin.js`,
		format: "es",
		sourcemap: false
	},
	plugins: [nodeResolve({ browser: false, exportConditions: ["node"], preferBuiltins: true }), commonjs(), json()],
	// ws a des dépendances natives optionnelles (bufferutil / utf-8-validate) : on les ignore
	external: ["bufferutil", "utf-8-validate"],
	onwarn(warning, warn) {
		if (warning.code === "CIRCULAR_DEPENDENCY" || warning.code === "THIS_IS_UNDEFINED") return;
		warn(warning);
	}
};
