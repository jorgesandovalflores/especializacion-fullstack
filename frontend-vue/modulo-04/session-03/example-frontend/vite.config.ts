import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
	base: '/',
	build: {
        // o 'terser' si quieres más control
        minify: 'esbuild',

        terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},

        sourcemap: true
    },
	publicDir: 'public',
	logLevel: 'info',
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, 'src'),
		},
	},
	plugins: [vue(), sentryVitePlugin({
        org: "quebuu",
        project: "javascript-vue"
    })],
})