# CareBridge

CareBridge is a React healthcare access demo for health guidance, well-being check-ins, nearby hospitals, and a personal health card.

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Features

- Health guidance with non-diagnostic next-step suggestions
- Well-being check-in
- Browser location map using Leaflet and OpenStreetMap
- Nearby hospital search using the OpenStreetMap Overpass API
- Health card saved in browser `localStorage`
- Responsive layout and keyboard focus states

The map needs internet access and location permission. If location permission is denied, it uses a fallback position.

## Docker

With Docker Desktop installed, run:

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

The Docker image builds the Vite app and serves it with Nginx. The health card is still stored per browser because no cloud backend has been configured yet.

## Validate

```bash
npm run build
npm run lint
```

The linter currently reports one non-blocking React effect warning in the map search code.
