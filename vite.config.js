import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/', // Set the base path for assets
    build: {
        outDir: 'dist' // Ensure the output directory is correct
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://case-bud-backend.vercel.app',
                changeOrigin: true,
                secure: false
            }
        }
    }
});
