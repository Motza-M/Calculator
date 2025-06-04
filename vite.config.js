import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow previewing from hosted environments like CodeSandbox
    allowedHosts: 'all',
  },
});
