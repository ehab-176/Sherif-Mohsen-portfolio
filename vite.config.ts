import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Fast-refresh preview on localhost. No AI Studio runtime is involved.
    plugins: [react(), tailwindcss()],
    // The self-contained offline preview is a generated HTML artifact in the
    // project root; exclude it from dev dependency scanning.
    optimizeDeps: { entries: ['index.html'] },
  };
});
