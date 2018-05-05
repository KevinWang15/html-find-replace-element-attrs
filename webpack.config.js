const webpack = require('webpack');

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  target: "node",
  output: {
    path: __dirname + "/dist",
    filename: "main.js",
    libraryTarget: "umd",
    library: "htmlFindReplaceElementAttrs",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  }
};