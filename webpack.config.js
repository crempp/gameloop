const path = require("path");
const { dependencies } = require('./package.json');

module.exports = {
  entry: {
    "gameloop" : "./src/gameloop.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: "babel-loader?presets[]=env"
      }
    ]
  },
};