import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Glasgow University Boat Club',
  description: 'Welcome to the Glasgow University Boat Club',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl">
          <h1 className="text-3xl font-bold">Glasgow University Boat Club</h1>
        </div>
      </div>

      <div className="relative flex place-items-center pt-32">
        <h2 className="text-2xl">Welcome to GUBC</h2>
      </div>
    </main>
  )
}
