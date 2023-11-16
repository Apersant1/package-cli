import webpack, { Configuration, Stats } from "webpack";
import { BuildOptions } from "../arguments";
import { Mode, generatePaths } from "../paths";
import { merge } from "webpack-merge";
import { getCommonWidgetConfig } from "../configs/webpack/common";
import { getPackageConfig } from "../configs/webpack/buildPaсkage";

export const runBuild = async (args: BuildOptions) => {
  const mode: Mode = "production";

  const PATHS = generatePaths({
    entryPath: args.entry,
  });

  const configList = [
    getCommonWidgetConfig(mode, PATHS),
    getPackageConfig(mode, PATHS),
  ] as Configuration[];

  try {
    build(configList);
  } catch (error: any) {
    console.error("Failed to compile.\n");
    console.error(error);
    process.exit(1);
  }
};

function build(config: webpack.Configuration[]) {
  const compiler = webpack(config);

  return compiler.run((err: any, stats) => {
    if (err) {
      console.error(err.stack || err);

      if (err?.details) {
        console.error(err.details);
      }

      return;
    }

    stats &&
      console.log(
        stats?.toString({
          chunks: false,
          colors: true,
        })
      );
  });
}
