import type { Mode, Paths } from "../../paths.js";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import webpack, { type Configuration } from "webpack";
import { systemRequire } from "../../utils.js";
import { WIDGET_RESOURCES_DIR_NAME, MANIFEST_REG_EXP } from "../../const.js";
import { cssLoaders } from "./sections/loaders/cssLoaders.js";

const { ProgressPlugin } = webpack;

const isProduction = (mode: Mode) => mode === "production";
const isDevelopment = (mode: Mode) => mode === "development";

export const getCommonWidgetConfig = (
  mode: Mode,
  PATHS: Paths
): Configuration => {
  return {
    mode,
    entry: [PATHS.moduleIndex, PATHS.manifestJson],
    output: {
      path: PATHS.appBuild,
      filename: systemRequire(PATHS.manifestJson).entry,
      asyncChunks: false,
      clean: true,
    },
    plugins: [
      new ProgressPlugin(),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          mode: "write-references",
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: PATHS.resourcesWidget,
            toType: "dir",
            to: WIDGET_RESOURCES_DIR_NAME,
            noErrorOnMissing: true,
          },
        ],
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|ts|jsx|tsx)$/i,
          exclude: ["/node_modules/"],
          loader: systemRequire.resolve("babel-loader"),
          options: {
            plugins: [
              systemRequire.resolve("babel-plugin-inline-json-import"),
              systemRequire.resolve("@babel/plugin-transform-runtime"),
              !isProduction(mode) &&
                systemRequire.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
        {
          test: /\.css$/i,
          use: cssLoaders,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            ...cssLoaders,
            {
              loader: systemRequire.resolve("sass-loader"),
              options: {
                implementation: systemRequire("sass"),
                sassOptions: {
                  fiber: false,
                },
              },
            },
          ],
        },
        {
          test: /\.less$/i,
          use: [
            ...cssLoaders,
            {
              loader: systemRequire.resolve("less-loader"),
              options: {
                sourceMap: isDevelopment(mode),
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2|png|jpg|jpeg|webp|gif)$/i,
          type: "asset/inline",
        },
        {
          test: MANIFEST_REG_EXP,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.svg$/i,
          oneOf: [
            {
              type: "asset",
              resourceQuery: /url/, // *.svg?url
              parser: {
                dataUrlCondition: {
                  maxSize: 64 * 1024, // 64kb
                },
              },
              generator: {
                filename: "build/static/[hash][ext][query]",
              },
            },
            {
              issuer: /\.[jt]sx?$/,
              loader: systemRequire.resolve("@svgr/webpack"),
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      name: "removeViewBox",
                      active: false,
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      plugins: [new TsconfigPathsPlugin()],
    },
  };
};
