const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/'
  },
  devtool: 'source-map',
  resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
      rules: [
          {
              test: /\.(js|jsx|ts|tsx)$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                  presets: [
                      '@babel/preset-env',
                      '@babel/preset-react'
                  ]
              }
          },
          { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
          { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
      ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist/'),
    port: 3000,
    publicPath: 'http://localhost:3000/'
  },
};
