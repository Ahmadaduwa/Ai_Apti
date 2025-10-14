# Infrastructure and Environment

Copy `.env.sample` to `.env` before running docker compose. Toggle `DEMO_MODE=true` to enable the demo token.

```
cp infra/.env.sample infra/.env
```

Services:
- Postgres (port 5432)
- Redis (port 6379)
- API (Express on 3001)
- ML (FastAPI on 8000)
- Web (Vite on 5173)

