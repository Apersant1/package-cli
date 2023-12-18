import { systemRequire } from "../../../../utils.js";

export const cssLoaders = [
  systemRequire.resolve("style-loader"),
  systemRequire.resolve("css-loader"),
  {
    loader: systemRequire.resolve("postcss-loader"),
    options: {
      postcssOptions: {
        plugins: [
          systemRequire.resolve("postcss-preset-env"),
          systemRequire.resolve("autoprefixer"),
        ],
      },
    },
  },
];
