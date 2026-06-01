'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            🏉 Rugby Planner
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-primary/80 rounded"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="bg-primary/95 border-t border-white/20">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 hover:bg-white/10 rounded"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/sessions"
                className="block px-4 py-2 hover:bg-white/10 rounded"
              >
                My Sessions
              </Link>
              <Link
                href="/dashboard/create"
                className="block px-4 py-2 hover:bg-white/10 rounded"
              >
                Create Session
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-white/10 rounded text-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop navigation */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8 py-4">
            <Link href="/dashboard" className="text-primary font-medium hover:text-accent">
              Dashboard
            </Link>
            <Link href="/dashboard/sessions" className="text-gray-600 hover:text-primary">
              My Sessions
            </Link>
            <Link href="/dashboard/create" className="text-gray-600 hover:text-primary">
              Create Session
            </Link>
            <button
              onClick={handleLogout}
              className="ml-auto text-gray-600 hover:text-red-600"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
