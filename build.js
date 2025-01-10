const esbuild = require('esbuild');
const webSocketManagerPath = "src/WebSocketManager.js";

esbuild.build({
    entryPoints: ['src/index.js'],
    inject: [
        webSocketManagerPath
    ],
    bundle: true,
    minify: true,
    outfile: 'dist/bridge.min.js'
})