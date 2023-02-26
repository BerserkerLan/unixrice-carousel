import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      external: ['popper.js'],
      output: {
        globals: {
          'popper.js': 'Popper'
        }
      }
    }
  },
  ssr: {
    noExternal: ['@popperjs/core']
}
});
