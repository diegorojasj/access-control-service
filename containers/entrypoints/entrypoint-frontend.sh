#!/bin/sh
set -e

CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

write_http_config() {
  envsubst '$BACKEND_URL' > /etc/nginx/conf.d/default.conf << NGINX
server {
    listen 80;
    server_name _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location ~ ^/access-control-service/(auth|user|role|todo|permission)(/.*)?$ {
        rewrite ^/access-control-service/(.*)$ /\$1 break;
        proxy_pass ${BACKEND_URL};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }

    location /access-control-service/ {
        alias /usr/share/nginx/html/;
        try_files \$uri \$uri/ /access-control-service/index.html;
    }

    location = / {
        return 301 /access-control-service/;
    }
}
NGINX
}

write_https_config() {
  envsubst '$DOMAIN $BACKEND_URL' < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf
}

if [ -f "$CERT" ]; then
  echo "[entrypoint] Certificate found, starting with HTTPS."
  write_https_config
  exec nginx -g 'daemon off;'
else
  echo "[entrypoint] No certificate found. Starting HTTP-only while certbot issues one..."
  write_http_config
  nginx -g 'daemon off;' &

  echo "[entrypoint] Waiting for certificate at ${CERT}..."
  until [ -f "$CERT" ]; do
    sleep 5
  done

  echo "[entrypoint] Certificate obtained. Reloading nginx with HTTPS config."
  write_https_config
  nginx -s reload

  wait
fi
