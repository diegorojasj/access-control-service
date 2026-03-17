# Security

## Overview

When a user logs in, the system gives them a **token** (a temporary ID badge). Every time the user makes a request, they show that badge to prove who they are. The system checks the badge is real and hasn't expired before allowing access.

Tokens are valid for **1 hour**. After that, the user needs to log in again.

---

## Creating a token (login)

When a user successfully logs in, a token is created for them. The token contains:

- **Who they are** (`sub`) — their user identifier
- **Where the token is for** (`aud`) — this app's API
- **Who issued it** (`iss`) — this backend service
- **When it was created** (`iat`)
- **When it expires** (`exp`)
- **Any extra information** (`extra`) — optional (e.g. username, roleName)

---

## Verifying a token (protected requests)

Every time the user accesses a protected page or action, the system:

1. Reads the token they sent
2. Checks it hasn't been tampered with
3. Checks it hasn't expired

If any of these checks fail, access is denied and the token received is revoked. If everything is fine, the request is allowed to proceed.

---

## Security model

Tokens are **signed**, not just encoded. This means:

- Only this backend can **create** valid tokens (using a private key)
- Anyone with the public key can **verify** a token is genuine — but cannot forge one
- Even if someone reads the token, they cannot modify it without the signature becoming invalid

The signing is done using two key files stored in `backend/src/keys/`:

| File | Role |
|------|------|
| `private_key.pem` | Used to **sign** tokens — must be kept secret |
| `public_key.pem` | Used to **verify** tokens — can be shared safely |

and it's necessary to create a new pair of keys to rotate the tokens.