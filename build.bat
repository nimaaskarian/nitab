@echo off
cd ./build
npm run build && web-ext build && cd web-ext-artifacts && start . && cd ../..
