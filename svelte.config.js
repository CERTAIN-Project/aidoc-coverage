import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    paths: { base },
    prerender: {
      handleHttpError: ({ message }) => {
        // When base is set, the prerenderer may visit paths without the prefix - expected.
        if (message.includes('does not begin with `base`')) return;
        throw new Error(message);
      }
    }
  }
};

export default config;
