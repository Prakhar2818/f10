# f10

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
