/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@', replacement: resolve(__dirname, 'src') },
            { find: '@components', replacement: resolve(__dirname, 'src/components') },
            { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
            { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
            { find: '@services', replacement: resolve(__dirname, 'src/services') },
            { find: '@styles', replacement: resolve(__dirname, 'src/styles') },
            { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
            { find: '@types', replacement: resolve(__dirname, 'src/types') },
            { find: '@constants', replacement: resolve(__dirname, 'src/constants') },
            { find: '@layouts', replacement: resolve(__dirname, 'src/layouts') },
        ],
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'src/test/setup.ts', '**/*.d.ts', '**/*.config.*', '**/types/*'],
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
});
