# ---- Build stage ----
FROM oven/bun:1 AS builder
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

# Copy frontend source
COPY frontend/ ./

# Run build directly
ARG PUBLIC_PATH=/access-control-service/
RUN bun run build.ts --public-path=${PUBLIC_PATH}

# ---- Production stage ----
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY containers/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY containers/entrypoints/entrypoint-frontend.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
