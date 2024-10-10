import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

import * as path from "node:path"
import { fileURLToPath } from "node:url"

const filesNeedToExclude = ["**/source_data/**"]

const filesPathToExclude = filesNeedToExclude.map((src) => {
  return fileURLToPath(new URL(src, import.meta.url))
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5080,
    watch: {
      ignored: ["**/source_data/**"],
    },
  },
})
