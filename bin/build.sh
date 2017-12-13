#!/bin/bash

# Build server
babel src/cli --presets babel-preset-env --out-dir dist/cli

# Build library
./node_modules/.bin/webpack