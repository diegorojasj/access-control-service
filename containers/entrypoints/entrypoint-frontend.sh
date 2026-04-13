#!/bin/sh
set -e

RESOLVER=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
export RESOLVER

envsubst '$BACKEND_URL $RESOLVER' < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
