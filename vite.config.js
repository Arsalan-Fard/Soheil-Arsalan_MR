import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Page/', // Matches your GitHub repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
