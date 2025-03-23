import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    server: {
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'https://case-bud-backend-1.onrender.com',
                changeOrigin: true,
                secure: false
            }
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true
                }),
                NodeModulesPolyfillPlugin()
            ],
            define: {
                global: 'globalThis',
                'process.env': {}
            }
        }
    },
    resolve: {
        alias: {
            fs: 'browserfs/dist/shims/fs.js',
            path: 'path-browserify',
            buffer: 'buffer'
        }
    }
});