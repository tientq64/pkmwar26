// import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 5500,
    },
    resolve: {
        tsconfigPaths: true,
    },
    plugins: [tailwindcss()],
})
