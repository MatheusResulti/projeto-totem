import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

<<<<<<< HEAD
// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
=======
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
  build: { outDir: "dist" },  
>>>>>>> 189e5da (alterações feitas para o exe)
});
