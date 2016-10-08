/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

var __DEV__ = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: __DEV__ ? 'inline-source-map' : false,
  entry: {
    'background': './src/background.js',
    'devtool':'./src/devtool.js',
    'inspector':'./src/inspector.js'
    //inject: './src/GlobalHook.js',
   // contentScript: './src/contentScript.js',
    //panel: './src/panel.js',
  },
  output: {
    path:  __dirname+'/lib',
    filename: '[name].js',
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader:  'babel?presets[]=es2015',
      exclude: /node_modules/,
    }],
  },
};
