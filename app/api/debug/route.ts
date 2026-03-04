export async function GET() {
  return Response.json({
    server_env: process.env.SERVER_ONLY_TEST,
    public_env: process.env.NEXT_PUBLIC_TEST
  })
}