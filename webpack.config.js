const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const autoprefixer = require('autoprefixer');

module.exports = (env, argv) => {
  let envConsts = {};

  const envConfig = dotenv.config();

  if (envConfig.parsed) {
    const parsed = envConfig.parsed;
    Object.keys(parsed).forEach((key) => {
      envConsts[`${key}`] = JSON.stringify(parsed[key]);
    });
  }

  return {
    mode: argv.mode,
    devServer: {
      contentBase: path.resolve(__dirname, './build'),
      open: true,
      compress: true,
      port: 8080,
    },
    entry: path.resolve(__dirname, 'src', 'main.ts'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js',
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.s?css$/,
          use: [
            argv.mode === 'development'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
      }),
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].css',
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer()],
        },
      }),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: argv.mode === 'development' ? true : false,
        'process.env': {
          ...envConsts,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue$': 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.js', '.ts', '.vue', '.json'],
    },
    devServer: {
      historyApiFallback: true,
    },
  };
};
