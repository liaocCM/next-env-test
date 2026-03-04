export default function Home() {
  return (
    <div>
      <h1>Env Test</h1>
      <p>Client NEXT_PUBLIC_TEST: {process.env.NEXT_PUBLIC_TEST}</p>
    </div>
  )
}