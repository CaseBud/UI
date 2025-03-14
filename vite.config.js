import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
    }
});