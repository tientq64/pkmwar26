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
    build: {
        rollupOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: 'phaser',
                            test: /node_modules\/phaser/,
                        },
                        {
                            name: 'vendor',
                            test: /node_modules/,
                        },
                        {
                            name: 'data',
                            test: /src\/data/,
                        },
                    ],
                },
            },
        },
    },
    plugins: [tailwindcss()],
})
