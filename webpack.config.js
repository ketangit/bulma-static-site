const path = require('path'),
  webpack = require('webpack'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({ filename: 'styles.css' });

const config = {
  // absolute path for project root
  context: path.resolve(__dirname, 'src'),

  entry: {
    // relative path declaration
    app: './index.js'
  },

  output: {
    // absolute path declaration
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js'
  },

  module: {
    rules: [
      // babel-loader with 'env' preset
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: { presets: ['env'] } }
      },
      // html-loader
      { test: /\.html$/, use: ['html-loader'] },
      // sass-loader with sourceMap activated
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
        use: extractPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      // file-loader(for images)
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: './assets/images/' } }]
      },
      // file-loader(for fonts)
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] }
    ]
  },

  plugins: [
    // cleaning up only 'dist' folder
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'content.html'
    }),
    // extract-text-webpack-plugin instance
    extractPlugin
  ],

  devServer: {
    // static files served from here
    contentBase: path.resolve(__dirname, './dist/assets/images'),
    compress: true,
    // open app in localhost:2000
    port: 3000,
    stats: 'errors-only',
    open: false
  },

  devtool: 'inline-source-map'
};

module.exports = config;
