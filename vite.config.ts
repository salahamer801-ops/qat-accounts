import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// يضمن إرسال نوع المحتوى الصحيح لملف APK حتى يبدأ التحميل في المتصفح
function apkContentType(): Plugin {
  return {
    name: "apk-content-type",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.split("?")[0].endsWith(".apk")) {
          res.setHeader(
            "Content-Type",
            "application/vnd.android.package-archive",
          );
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="Qat-Accounts.apk"',
          );
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.split("?")[0].endsWith(".apk")) {
          res.setHeader(
            "Content-Type",
            "application/vnd.android.package-archive",
          );
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="Qat-Accounts.apk"',
          );
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apkContentType()],
});
