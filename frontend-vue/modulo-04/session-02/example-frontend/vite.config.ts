import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
    publicDir: 'public',
    logLevel: 'info',
    resolve: {
        alias: [
            {
                find: '/@src/',
                replacement: `/src/`,
            }
        ]
  },
  plugins: [vue()],
})
