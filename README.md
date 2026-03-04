# next-env-test

A minimal Next.js app for testing environment variable behavior on Google Cloud Run.

Demonstrates how `NEXT_PUBLIC_*` (client-side) and server-only env vars are handled across build time and runtime in a containerized deployment.

## Routes

| Route | Description |
|---|---|
| `/` | Displays `NEXT_PUBLIC_TEST` on the client |
| `/api/debug` | Returns JSON with `SERVER_ONLY_TEST` and `NEXT_PUBLIC_TEST` |

## Local Development

```bash
npm install
npm run dev
```

## Build & Deploy to Cloud Run

Build and push the image:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t <your-registry-path>/next-env-test:<tag> \
  --push .
```

Deploy to Cloud Run with runtime env vars:

```bash
gcloud run deploy next-env-test \
  --image <your-registry-path>/next-env-test:<tag> \
  --region asia-east1 \
  --set-env-vars SERVER_ONLY_TEST=SOT,NEXT_PUBLIC_TEST=hello
```

## Environment Variables

| Variable | Type | Available At |
|---|---|---|
| `NEXT_PUBLIC_TEST` | Public | Build time (inlined into client JS) |
| `SERVER_ONLY_TEST` | Server-only | Runtime (accessible in API routes / server components) |

> **Note:** `NEXT_PUBLIC_*` vars are baked into the client bundle at build time. Setting them via `--set-env-vars` at deploy time will only affect server-side reads. To change client-side values, rebuild the image with the new value.
