# uvicorn_config.py

host = "0.0.0.0"
port = 8000

# Enable auto-reload in development
reload = False

# Logging
log_level = "info"
access_log = True

# Workers (recommended for production)
workers = 4

# Lifespan handling
lifespan = "auto"

# HTTP protocol implementation
http = "h11"

# WebSocket implementation
ws = "auto"

# Proxy headers (if behind nginx / load balancer)
proxy_headers = True
forwarded_allow_ips = "*"

# Limit max requests before restart (helps memory leaks)
limit_max_requests = 10000
