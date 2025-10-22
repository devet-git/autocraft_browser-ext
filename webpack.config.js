const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const glob = require('glob');

//
// 🎯 1. Tạo entry tự động
//
function makeEntries(pattern) {
  const entries = {};
  glob.sync(pattern, { ignore: ['./src/background/**/*'] }).forEach((file) => {
    const relative = path.relative('./src', file);
    const normalized = path.posix.join(...relative.split(path.sep));
    const name = normalized.replace(/\.(t|j)sx?$/, '');
    entries[name] = './src/' + normalized;
  });
  return entries;
}

//
// Config for background (service worker)
//
const backgroundConfig = {
  name: 'background',
  mode: 'production',
  target: 'webworker',
  entry: { background: './src/background/background.ts' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'background/[name].js',
    clean: true,
    iife: false,
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  plugins: [new CleanWebpackPlugin()],
};

//
// Config for content, popup, options, etc
//
const uiEntries = makeEntries('./src/**/index.{ts,tsx}');

const htmlPlugins = Object.keys(uiEntries)
  .filter((name) => name.startsWith('popup') || name.startsWith('options'))
  .map((name) => {
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: `src/${name}.html`,
      chunks: [name],
    });
  });

const uiConfig = {
  name: 'ui',
  mode: 'production',
  target: 'web',
  entry: uiEntries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '.' },
        {
          from: '**/*.{css}',
          context: path.resolve(__dirname, 'src'),
          to: '[path][name][ext]',
        },
      ],
    }),
    ...htmlPlugins,
  ],
};

module.exports = [backgroundConfig, uiConfig];
