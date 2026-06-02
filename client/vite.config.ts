import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: [".devtunnels.ms", "localhost", "127.0.0.1"],
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/ws": {
        target: backendUrl,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
