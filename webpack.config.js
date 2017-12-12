const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { dependencies } = require('./package.json');

let pathsToClean = [
  'dist'
];

let cleanOptions = {
  root:     path.resolve(__dirname),
  verbose:  true,
  dry:      false
};

module.exports = {
  // resolve: { symlinks: false },
  entry: {
    "gameloop" : "./src/gameloop.js",
    "server/server": "./src/server/server.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  devtool: "source-map",
  module: {
    // noParse: [path.resolve(__dirname, "src/cli")],
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        exclude: [
          // /node_modules/,
        ],
        loader: "babel-loader?presets[]=es2015"
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new CopyWebpackPlugin([
      { from: 'src/cli/cli.js', to: 'cli/cli.js' }
    ]),
  ],

  externals: [
    ...Object.keys(dependencies || {})
  ]
};