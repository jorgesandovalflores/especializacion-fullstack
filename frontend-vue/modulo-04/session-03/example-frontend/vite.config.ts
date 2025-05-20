import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
	base: '/',
	build: {
		minify: 'esbuild', // o 'terser' si quieres más control
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	},
	publicDir: 'public',
	logLevel: 'info',
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, 'src'),
		},
	},
	plugins: [vue()],
})
