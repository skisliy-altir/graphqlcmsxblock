const path = require("path");
var webpack = require("webpack");
module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "./studio/js"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
