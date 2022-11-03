const path = require('path');

module.exports = {
  entry: './lib/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'cdn.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
