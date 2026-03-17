# Architecture

## Overview

The system is composed of two main components: a **frontend** and a **backend** with a **Modular Monolith with Layered (N-Tier) Architecture per module**. The frontend is a web application that allows users to interact with the system, and the backend is a REST API that provides data to the frontend.

## Frontend

The frontend is a web application built with **React** and **TypeScript**. It uses **Zustand** for state management, **shadcn/ui** for UI components and **Sileo** for toast notifications.

## Backend

The backend is a REST API built with **FastAPI** and **Python**. It uses **SQLAlchemy** for database interaction and **Paseto** for token management.

## Database

The database is a **PostgreSQL** database that stores the system's data.

## Infrastructure

The system is deployed in a **Docker/Podman** container that runs the frontend, backend, and database.