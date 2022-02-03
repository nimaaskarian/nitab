@echo off
cd ./build
npm run s && web-ext build && cd web-ext-artifacts && start . && cd ../..
