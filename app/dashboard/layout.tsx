'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-950 text-white shadow border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Rugby Practice Planner" width={100} height={100} className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-800 rounded transition"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="bg-slate-900 border-t border-slate-700">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 hover:bg-slate-800 rounded transition text-slate-300 hover:text-lime-400"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/sessions"
                className="block px-4 py-2 hover:bg-slate-800 rounded transition text-slate-300 hover:text-lime-400"
              >
                My Sessions
              </Link>
              <Link
                href="/dashboard/create"
                className="block px-4 py-2 hover:bg-slate-800 rounded transition text-slate-300 hover:text-lime-400"
              >
                Create Session
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded transition text-red-400 hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop navigation */}
      <div className="hidden md:block bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8 py-4">
            <Link href="/dashboard" className="text-lime-400 font-medium hover:text-lime-300 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/sessions" className="text-slate-400 hover:text-lime-400 transition">
              My Sessions
            </Link>
            <Link href="/dashboard/create" className="text-slate-400 hover:text-lime-400 transition">
              Create Session
            </Link>
            <button
              onClick={handleLogout}
              className="ml-auto text-slate-400 hover:text-red-400 transition"
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
