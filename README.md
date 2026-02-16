# Access Control Service

## Overview
A standalone RBAC microservice with FastAPI. Features: user/role/permission management, middleware-based route protection, permission inheritance (admin > manager > viewer), JWT with HTTP-only cookie auth, and a React admin panel to manage roles visually with shadcn/ui.

## Tech Stack
**Frontend:** Bun, React.js, shadcn/ui, tailwindcss

**Backend:** Python, uvicorn, FastAPI, SQLAlchemy

**Database:** PostgreSQL

**Tools:** Podman Compose


## Project Structure

Poman Containers:
- postgres
- backend
- nginx(frontend)

## 🔐 Security Instructions
To rotate the key pair (private key and public key), execute the following commands in `backend/src/keys` folder and replace the old files:

```bash
openssl genpkey -algorithm ed25519 -out private_key.pem
openssl pkey -in private_key.pem -pubout -out public_key.pem
```