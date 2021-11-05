import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import legacy from '@vitejs/plugin-legacy'
import { dependencies } from './package.json';

const manualVendorChunks: {[k: string]: string[]} = {
  vue: ["vue", "vue-router"]
}

function renderChunks(deps: Record<string, string>) {
  let chunks: {[k: string]: string[]} = {};
  Object.keys(deps).forEach((key) => {
    for (let name in manualVendorChunks) if (manualVendorChunks[name].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          ...manualVendorChunks,
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [
      vue(),
      // legacy()
  ]
})
