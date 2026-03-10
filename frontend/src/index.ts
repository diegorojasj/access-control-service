import { serve } from "bun";
import index from "./index.html";

const API_BASE_URL = process.env.BUN_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

async function proxyToBackend(req: Request): Promise<Response> {
  const { pathname, search } = new URL(req.url)
  return fetch(`${API_BASE_URL}${pathname}${search}`, {
    method: req.method,
    headers: req.headers,
    body: req.body ?? undefined,
  })
}

const server = serve({
  port: Number(process.env.FRONTEND_PORT ?? 3000),
  routes: {
    "/auth/*": proxyToBackend,
    "/user/*": proxyToBackend,
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
