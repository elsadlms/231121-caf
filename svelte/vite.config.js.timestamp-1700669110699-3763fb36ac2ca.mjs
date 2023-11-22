// vite.config.js
import { defineConfig } from "file:///Users/edelmas/Documents/code/20231109_caf/svelte/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "url";
import { svelte } from "file:///Users/edelmas/Documents/code/20231109_caf/svelte/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/edelmas/Documents/code/20231109_caf/svelte/vite.config.js";
var vite_config_default = defineConfig(({ command }) => {
  const moduleExports = `
    export const init = window.__svelte_scrllgngn_module.init
    export const update = window.__svelte_scrllgngn_module.update
  `;
  const filename = process.env.VITE_MODULE ?? "build";
  return {
    // [WIP] export multiple modules?
    plugins: [svelte()],
    resolve: {
      alias: [
        {
          find: "~",
          replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
        }
      ]
    },
    build: {
      rollupOptions: {
        input: `./src/main.js`,
        output: {
          format: "iife",
          dir: "./public/build",
          entryFileNames: `${filename}.js`,
          assetFileNames: "bundle.css",
          footer: command === "build" && moduleExports
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZWRlbG1hcy9Eb2N1bWVudHMvY29kZS8yMDIzMTEwOV9jYWYvc3ZlbHRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZWRlbG1hcy9Eb2N1bWVudHMvY29kZS8yMDIzMTEwOV9jYWYvc3ZlbHRlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9lZGVsbWFzL0RvY3VtZW50cy9jb2RlLzIwMjMxMTA5X2NhZi9zdmVsdGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAndXJsJ1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcbiAgY29uc3QgbW9kdWxlRXhwb3J0cyA9IGBcbiAgICBleHBvcnQgY29uc3QgaW5pdCA9IHdpbmRvdy5fX3N2ZWx0ZV9zY3JsbGduZ25fbW9kdWxlLmluaXRcbiAgICBleHBvcnQgY29uc3QgdXBkYXRlID0gd2luZG93Ll9fc3ZlbHRlX3NjcmxsZ25nbl9tb2R1bGUudXBkYXRlXG4gIGBcblxuICBjb25zdCBmaWxlbmFtZSA9IHByb2Nlc3MuZW52LlZJVEVfTU9EVUxFID8/ICdidWlsZCdcblxuICByZXR1cm4ge1xuICAgIC8vIFtXSVBdIGV4cG9ydCBtdWx0aXBsZSBtb2R1bGVzP1xuICAgIHBsdWdpbnM6IFtzdmVsdGUoKV0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6ICd+JyxcbiAgICAgICAgICByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGlucHV0OiBgLi9zcmMvbWFpbi5qc2AsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgIGRpcjogJy4vcHVibGljL2J1aWxkJyxcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogYCR7ZmlsZW5hbWV9LmpzYCxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogJ2J1bmRsZS5jc3MnLFxuICAgICAgICAgIGZvb3RlcjogY29tbWFuZCA9PT0gJ2J1aWxkJyAmJiBtb2R1bGVFeHBvcnRzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVSxTQUFTLG9CQUFvQjtBQUNsVyxTQUFTLGVBQWUsV0FBVztBQUNuQyxTQUFTLGNBQWM7QUFGbUwsSUFBTSwyQ0FBMkM7QUFLM1AsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxRQUFRLE1BQU07QUFDM0MsUUFBTSxnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFLdEIsUUFBTSxXQUFXLFFBQVEsSUFBSSxlQUFlO0FBRTVDLFNBQU87QUFBQTtBQUFBLElBRUwsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUFBLElBQ2xCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLFFBQzlEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGVBQWU7QUFBQSxRQUNiLE9BQU87QUFBQSxRQUNQLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLEtBQUs7QUFBQSxVQUNMLGdCQUFnQixHQUFHLFFBQVE7QUFBQSxVQUMzQixnQkFBZ0I7QUFBQSxVQUNoQixRQUFRLFlBQVksV0FBVztBQUFBLFFBQ2pDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
