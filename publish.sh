#!/usr/bin/env bash
rm -rf build
yarn tsc
cp package.json build/
cp yarn.lock build/
cp README.md build/
cd build/
rm -rf pages
rm -rf routes.*
yarn
yarn test
rm -rf node_modules