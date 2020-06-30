const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.join(__dirname, '/src', 'wrapper.jsx'),

  output: {
    path: path.join('C:/Users/JRLohi01/Desktop/new/working/Express App/public/', 'javascripts'),
    filename: 'RealBIApp.bundle.js',
    libraryTarget: 'this',
    library: 'RealBIApp',
  },

  mode: process.env.NODE_ENV || 'development',
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },
  module: {
    rules: [
      {
        // this is so that we can compile any React,
        // ES6 and above into normal ES5 syntax
        test: /\.(js|jsx)$/, // we do not want anything from node_modules to be compiled
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'css-loader', // translates CSS into CommonJS
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        loaders: ['file-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new Dotenv({
      path: './.env',
    }),
  ],
};
