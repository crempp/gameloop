const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    "gameloop.js" : "./src/gameloop.js",
    "style/gameloop.css" : "./src/templates/gameloop.scss"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]"
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
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader!sass-loader"
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "style/gameloop.css"
    }),
  ]
};
