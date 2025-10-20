const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');

//
// 🎯 1. Tạo entry tự động
//
function makeEntries(pattern) {
  const entries = {};
  glob.sync(pattern, { ignore: ['./src/background.ts'] }).forEach((file) => {
    const relative = path.relative('./src', file);
    const normalized = path.posix.join(...relative.split(path.sep));
    const name = normalized.replace(/\.ts$/, '');
    entries[name] = './src/' + normalized;
  });
  return entries;
}

//
// ⚙️ 2. Config riêng cho background (service worker)
//
const backgroundConfig = {
  name: 'background',
  mode: 'production',
  target: 'webworker', // Quan trọng!
  entry: { background: './src/background.ts' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
    iife: false, // Quan trọng!
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
};

//
// 💻 3. Config cho content, popup, options, etc
//
const uiConfig = {
  name: 'ui',
  mode: 'production',
  target: 'web',
  entry: makeEntries('./src/**/*.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '.' },
        {
          from: '**/*.{html,css}',
          context: path.resolve(__dirname, 'src'),
          to: '[path][name][ext]',
        },
      ],
    }),
  ],
};

module.exports = [backgroundConfig, uiConfig];
