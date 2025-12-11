import { defineConfig } from "vite";

export default defineConfig({
  base: '/digi-mock-api/', // This is CRUCIAL for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
  publicDir: 'public',
});