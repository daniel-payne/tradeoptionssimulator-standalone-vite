// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-line
import { fileURLToPath, URL } from "url"

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  server: {
    watch: {
      ignored: ["**/source_data/**"],
    },
  },
})
