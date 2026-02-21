import os
from typing import Literal, cast

# uvicorn_config.py

host = os.getenv("HOST")
port = os.getenv("PORT")

# Enable auto-reload in development
reload = os.getenv("RELOAD", "false").lower() == "true"

# Logging
log_level = os.getenv("LOG_LEVEL", "info")
access_log = os.getenv("ACCESS_LOG", "true").lower() == "true"

# Workers (recommended for production)
workers = int(os.getenv("WORKERS") or "4")

# Lifespan handling
lifespan = cast(Literal["auto", "off", "on"], os.getenv("LIFESPAN", "auto"))

# HTTP protocol implementation
http = os.getenv("HTTP", "h11")

# WebSocket implementation
ws = os.getenv("WS", "auto")

# Proxy headers (if behind nginx / load balancer)
proxy_headers = os.getenv("PROXY_HEADERS", "true").lower() == "true"
forwarded_allow_ips = os.getenv("FORWARDED_ALLOW_IPS", "*")

# Limit max requests before restart (helps memory leaks)
limit_max_requests = int(os.getenv("LIMIT_MAX_REQUESTS") or "10000")
