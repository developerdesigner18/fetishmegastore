import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

const domain = "fetishmegastore.com";
const homedir = require("os").homedir();

console.log('GOO',homedir);

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    server: {
        https: {
            key: homedir + "/.config/valet/Certificates/" + domain + ".key",
            cert: homedir + "/.config/valet/Certificates/" + domain + ".crt",
        }
    },
     build: {
        outDir: 'public/build', // Laravel's public directory
      },
    rollupOptions: {
        external: ['file-saver']
    }
});
