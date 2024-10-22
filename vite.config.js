import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        minify: "terser",
        target: "es2022"
  },
  esbuild: {
    target: "es2022"
  },
  optimizeDeps:{
    esbuildOptions: {
      target: "es2022",
    }
  }
})