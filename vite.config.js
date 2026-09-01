import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import url from "node:url";

function apiMiddlewarePlugin() {
  return {
    name: "api-dev-server-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith("/api/")) return next();

        const env = loadEnv("development", process.cwd(), "");
        for (const [k, v] of Object.entries(env)) {
          if (process.env[k] === undefined) process.env[k] = v;
        }

        const parsedUrl = new url.URL(req.url, `http://${req.headers.host || "localhost"}`);
        const pathname = parsedUrl.pathname;

        try {
          if (pathname === "/api/auth/login" && req.method === "POST") {
            const { default: handler } = await import("./api/auth/login.js");
            await handler(req, res);
            return;
          }
          if (pathname === "/api/auth/logout" && req.method === "POST") {
            const { default: handler } = await import("./api/auth/logout.js");
            await handler(req, res);
            return;
          }
          if (pathname === "/api/content") {
            const { default: handler } = await import("./api/content.js");
            await handler(req, res);
            return;
          }
          if (pathname.startsWith("/api/admin/")) {
            const subPath = pathname.replace(/^\/api\/admin\//, "");
            const parts = subPath.split("/").filter(Boolean);
            if (parts.length === 1) {
              req.query = { resource: parts[0] };
              const { default: handler } = await import("./api/admin/[resource].js");
              await handler(req, res);
              return;
            } else if (parts.length === 2) {
              req.query = { resource: parts[0], id: parts[1] };
              const { default: handler } = await import("./api/admin/[resource]/[id].js");
              await handler(req, res);
              return;
            }
          }
          next();
        } catch (err) {
          console.error("Vite API middleware error:", err);
          res.statusCode = err.status || 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: err.message || "Internal server error" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiMiddlewarePlugin()],
  server: { port: 5173, open: true },
});
