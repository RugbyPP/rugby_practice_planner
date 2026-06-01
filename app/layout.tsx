import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rugby Practice Planner',
  description: 'RFU-informed, age-grade aware rugby session planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
