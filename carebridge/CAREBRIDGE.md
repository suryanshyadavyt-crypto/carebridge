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

## Publish Without Docker

The simplest option is a static host such as Vercel or Netlify.

### Vercel

1. Create a GitHub repository and push this `carebridge` folder.
2. Import the repository at `https://vercel.com/new`.
3. Vercel detects the included `vercel.json`, builds the app, and gives you a public URL.

To temporarily take it offline, open the Vercel project and choose **Project Settings > Deployment Protection**, or remove the production deployment. To bring it back, redeploy the same project. To permanently remove it, use **Project Settings > Advanced > Delete Project**.

### Netlify

1. Create a GitHub repository and push this `carebridge` folder.
2. Add the repository at `https://app.netlify.com/start`.
3. Netlify uses the included `netlify.toml` and publishes the `dist` folder.

To take it offline, choose **Project configuration > Project details > Disable project**. Re-enable or redeploy it later from the same project. You can also delete the project permanently.

### Local production preview

```bash
npm run build
npm run preview
```

This creates the same optimized build used by the hosting services. The hosted site only needs a browser; Docker is optional.

## Validate

```bash
npm run build
npm run lint
```

The linter currently reports one non-blocking React effect warning in the map search code.
