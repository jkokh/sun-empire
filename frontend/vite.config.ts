import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        cors: true, // Enable CORS for all origins or configure appropriately
        // Ensure the dev server is running on the expected port
        port: 5173,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@root': path.resolve(__dirname, './'),
        },
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: 'modern-compiler',
            },
        },
    },
    build: {
        assetsDir: 'js',
        manifest: true,
        outDir: '../dist/public',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/antd')) {
                        return 'antd';
                    }
                }
            },
            input: 'src/app.tsx',
        },
    },
});
