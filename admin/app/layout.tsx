import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GUBC Admin - Glasgow University Boat Club',
  description: 'Glasgow University Boat Club Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
