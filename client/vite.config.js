import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development, requests to /api are proxied to the Express server
// so you don't have to worry about CORS or hard-coding the backend URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
