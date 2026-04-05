# f10

## Deploy

### Render + Render Postgres + MongoDB Atlas

This app is set up to deploy with:
- Render Web Service for the backend
- Render Postgres for Prisma and PostgreSQL
- MongoDB Atlas for Mongo storage

The repo includes a Render blueprint at [`render.yaml`](d:/f10/render.yaml).

### Required environment variables

Provided by Render Postgres:
- `DATABASE_URL`

Set manually in Render:
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_SECRET`
- `JWT_ACCESS_EXPIRES`
- `JWT_REFRESH_EXPIRES`

### Deploy flow

1. Push the repo to GitHub.
2. In Render, create a new Blueprint and select this repo.
3. Render will create the backend service and PostgreSQL database from [`render.yaml`](d:/f10/render.yaml).
4. In the Render dashboard, set `MONGO_URI` to your MongoDB Atlas connection string.
5. Set the JWT and session secret values.
6. Deploy and open the generated Render URL.

### MongoDB Atlas notes

- Create an Atlas cluster and a database user.
- Copy the Atlas connection string into `MONGO_URI`.
- Add an IP access list entry in Atlas that allows your deployed backend to connect.

## Observability

The API already exposes Prometheus metrics at `GET /metrics`.

### Start the backend

Run the app locally on port `5000`:

```bash
npm run dev
```

### Start Prometheus and Grafana

Run the observability stack:

```bash
docker compose -f docker-compose.observability.yml up -d
```

### Open the tools

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`
- Grafana login: `admin` / `admin`

Grafana is preconfigured with:
- a Prometheus datasource
- an `F10 Observability` dashboard

### Notes

- Prometheus scrapes the backend from `host.docker.internal:5000`
- Keep the backend running locally when using the Docker observability stack
- If your app port changes, update [`monitoring/prometheus/prometheus.yml`](d:/f10/monitoring/prometheus/prometheus.yml)
