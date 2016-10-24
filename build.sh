#!/bin/bash
rm -rf ./release/*
mkdir ./release/weex-devtool-extension

cd ./shells/chrome
NODE_ENV=production ../../node_modules/.bin/webpack --config ./webpack.config.js
rsync -R -r ./icons/* \
./lib/* \
./styles/* \
./contentScript.js \
./devtool.html \
./manifest.json \
./panel.html \
../../release/weex-devtool-extension/
cd ../../release

zip  -r weex-devtools-chrome.zip ./weex-devtool-extension