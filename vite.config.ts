import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 5173 is taken by VS Code forwarding ports from an SSH server, so the dev server uses its own port.
  server: { port: 5300, strictPort: true },
})
