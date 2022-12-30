#!/usr/bin/env bash
emcc base.c -O2 -s WASM=1 -s SIDE_MODULE=1 -s EXPORTED_FUNCTIONS='["main"]' -o base.wasm -s ERROR_ON_UNDEFINED_SYMBOLS=0
python3 -m http.server 8000
