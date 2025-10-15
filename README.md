# Ai-Apti

Prototype (MVP) for a School Management Information System with an AI-based student aptitude/career insight module.

Main technologies
- Backend API: Node.js (Express + TypeScript)
- ML service: Python (FastAPI)
- Frontend: React (Vite)
- Database: PostgreSQL
- Cache/session: Redis
- Orchestrated with Docker Compose

Quick start (recommended: Docker)

Prerequisites
- Docker Desktop (or Docker daemon available in WSL)
- Ports used by default:
  - API: 3001
  - ML (host): 8001 -> container:8000
  - Web (dev): 5173
  - Postgres: 5432
  - Redis: 6379

Environment
1. Copy the example env file and edit values as needed:
```
cp infra/.env.sample infra/.env
```
2. Important values to set in `infra/.env`: `DATABASE_URL`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `CORS_ORIGIN`, and `ML_BASE_URL`.

Start (Docker Compose)
```
docker compose up -d --build
```
- This will build and start Postgres, Redis, API, ML, and Web services.
- During API build the Prisma client is generated, and at container start the API entrypoint runs `npx prisma migrate deploy` before launching the server.

Check status & logs
- List running containers:
```
docker compose ps
```
- Tail API logs:
```
docker compose logs -f api
```
- Health endpoints used by the compose setup / entrypoint:
  - API health: `GET http://localhost:3001/health` (200 OK)
  - ML health (if present): `http://localhost:8001` (depends on ML service)
  - Web dev server: `http://localhost:5173` (Vite)

Reset database (destructive)
```
docker compose down -v
docker compose up -d --build
```
This removes the Postgres volume and reinitializes the database (useful for starting from a clean state).

Authentication / quick testing
- The API provides authentication endpoints (example):
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
- There is no automatic admin user seeded by default. Create accounts through the register endpoint or seed the DB manually.

Available API endpoints (MVP highlights)
- `GET /api/students/:id` (access control: parent-owner / teacher / admin)
- `POST /api/students` (teacher/admin)
- `GET /api/students/:id/ai-profile` (sample AI profile)
- `POST /api/students/:id/ai-run` (invoke ML service to analyze)

Project layout
- `apps/api` — Express API + Prisma
- `apps/ml` — FastAPI ML service
- `apps/web` — Vite React frontend
- `infra` — environment files and infra notes

Frontend

Dev (local Node)
```
cd apps/web
npm install
npm run dev -- --host
```
Open http://localhost:5173

Docker (run web in container for dev)
- The `apps/web` Dockerfile includes a builder (node) stage and an nginx runtime stage. The repository's compose config runs the builder stage for dev so `npm` is available; to start only the web dev server with compose:
```
docker compose up --build web
```

Production (static serving)
- For production use the nginx runtime stage (do not set `target: builder` in compose). Nginx will serve the built `dist/` folder.

Troubleshooting & tips
- If the frontend cannot call the API, check `CORS_ORIGIN` in `infra/.env`.
- If the API cannot connect to the DB, verify `DATABASE_URL` and that the `postgres` container is running and healthy (`pg_isready`).
- After schema changes in Prisma, use migrations and rebuild/images as needed. The API entrypoint runs `prisma migrate deploy` at container start.
- Native modules (e.g. `argon2`) must be built inside the image — do not copy `node_modules` from host into the container. The compose setup installs dependencies in the build stage to avoid ELF/binary mismatch issues.

Recommendations
- Add a `docker-compose.override.yml` for development to mount source folders and run dev commands while keeping `docker-compose.yml` production-friendly.
- Add a CI step that builds the images and runs `npx prisma migrate deploy` to detect build/migration issues early.

If you want, I can also create a `docker-compose.override.yml` for dev, generate an English README as `README.md` (replace), or add a simple GitHub Actions CI workflow — tell me which you'd like next.
