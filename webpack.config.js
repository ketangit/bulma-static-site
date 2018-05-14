var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var PurifyCSSPlugin = require('purifycss-webpack');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');

var folderDistribute = 'dist';
var switchMinify = false;
var useSSL = false;

var cssConfigEnvironments = {
  dev: ['style-loader', 'css-loader?sourceMap', 'sass-loader'],
  prod: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader']
  })
};

var envIsProd = process.env.NODE_ENV === 'prod';
var cssConfig = envIsProd ? cssConfigEnvironments['prod'] : cssConfigEnvironments['dev'];

module.exports = {
  entry: {
    app: ['./src/app.js']
  },
  output: {
    path: path.resolve(__dirname, folderDistribute),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        // Converts sass to css
        test: /\.(sass|scss)$/,
        use: cssConfig
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?name=images/[name].[ext]', // See https://github.com/webpack-contrib/file-loader
          'image-webpack-loader?bypassOnDebug' // See https://github.com/tcoopman/image-webpack-loader
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, folderDistribute), // Configure development server
    compress: true,
    port: 3000,
    https: useSSL,
    stats: 'errors-only',
    hot: true,
    open: false,
    openPage: ''
  },
  plugins: [
    new CleanWebpackPlugin(folderDistribute, {
      dry: !envIsProd
    }),
    new HtmlWebpackPlugin({
      // Builds .html, see https://github.com/jantimon/html-webpack-plugin
      title: 'Hello World from HtmlWebpackPlugin',
      minify: {
        collapseWhitespace: switchMinify
      },
      hash: true,
      template: './src/content.html'
    }),
    new FaviconsWebpackPlugin({
      logo: './src/images/logo.png',
      prefix: 'images/favicons/icons-[hash]/',
      emitStats: false,
      persistentCache: false,
      background: '#fff',
      title: 'Bulma App',
      icons: {
        favicons: true,
        firefox: false,
        android: false,
        appleIcon: false,
        appleStartup: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
        coast: false
      }
    }),
    new ExtractTextPlugin({
      // Builds .css, see https://github.com/webpack-contrib/extract-text-webpack-plugin
      filename: '[name].css',
      allChunks: true,
      disable: !envIsProd
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable HMR, see https://webpack.js.org/guides/hot-module-replacement/
    new webpack.NamedModulesPlugin(), // See https://webpack.js.org/plugins/named-modules-plugin/
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
      minimize: envIsProd,
      purifyOptions: {
        info: true,
        whitelist: ['*:not*']
      }
    })
  ]
};
