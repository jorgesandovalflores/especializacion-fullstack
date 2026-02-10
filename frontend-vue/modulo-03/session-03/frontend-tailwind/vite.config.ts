import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
    base: "./",
    plugins: [vue(), tailwindcss()],
    server: {
        host: true,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
});
