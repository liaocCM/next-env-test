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

## Testing

After deploying with `--set-env-vars SERVER_ONLY_TEST=SOT,NEXT_PUBLIC_TEST=hello`:

- Visit `/` — displays `Client NEXT_PUBLIC_TEST:` with **no value**.
- Visit `/api/debug` — returns:
  ```json
  { "server_env": "SOT" }
  ```

### Why `NEXT_PUBLIC_TEST` is empty

`NEXT_PUBLIC_*` vars **do not work at runtime**. During `next build`, Next.js finds every reference to `process.env.NEXT_PUBLIC_*` and **replaces it with the actual value** inline in the JavaScript bundle. After the build, the value is hardcoded — changing the env var at deploy time has no effect on client-side code.

Since the Docker image was built **without** `NEXT_PUBLIC_TEST` set, the value was replaced with `undefined` at build time and stays that way regardless of what Cloud Run's `--set-env-vars` provides.

`SERVER_ONLY_TEST` works fine because server-side code reads `process.env` at runtime as usual.

See: [Next.js Environment Variables docs](https://nextjs.org/docs/pages/guides/environment-variables)

## Environment Variables

| Variable | How it works |
|---|---|
| `NEXT_PUBLIC_TEST` | Inlined into client JS at **build time**. Must be set when running `next build`. Cannot be changed at deploy/runtime. |
| `SERVER_ONLY_TEST` | Read at **runtime**. Set via Cloud Run `--set-env-vars` and it just works. |
