const nodeLoaderRule = {
  test: /native_modules\/.+\.node$/u,
  use: "node-loader",
};
const relocatorRule = {
  test: /\.(m?js|node)$/u,
  parser: { amd: false },
  use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
          outputAssetBase: "native_modules",
      },
  },
};
const tsLoaderRule = {
  test: /\.tsx?$/u,
  exclude: /(node_modules|\.webpack)/u,
  use: {
      loader: "ts-loader",
      options: {
          transpileOnly: true,
      },
  },
};

if (process.env.BUILD_PRODUCTION) {
  module.exports = [nodeLoaderRule, relocatorRule, tsLoaderRule];
} else {
  module.exports = [nodeLoaderRule, tsLoaderRule];
}
