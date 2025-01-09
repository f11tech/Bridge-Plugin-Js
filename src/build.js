const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/Bridge.js'],
    bundle: true,
    outfile: 'dist/bridge.min.js',
})