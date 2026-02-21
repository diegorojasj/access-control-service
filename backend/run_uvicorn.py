import uvicorn
import uvicorn_config  # your file

def _int(v, default):
    try:
        return int(v) if v not in (None, "") else default
    except ValueError:
        return default

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=uvicorn_config.host or "0.0.0.0",
        port=_int(uvicorn_config.port, 8000),
        reload=uvicorn_config.reload,
        log_level=uvicorn_config.log_level,
        access_log=uvicorn_config.access_log,
        workers=_int(str(uvicorn_config.workers), 1),
        lifespan=uvicorn_config.lifespan,
        http=uvicorn_config.http,
        ws=uvicorn_config.ws,
        proxy_headers=uvicorn_config.proxy_headers,
        forwarded_allow_ips=uvicorn_config.forwarded_allow_ips,
        limit_max_requests=_int(
            str(uvicorn_config.limit_max_requests) if uvicorn_config.limit_max_requests is not None else "",
            0,
        ),
    )