'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Build better rugby sessions in minutes.
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            RFU-informed, age-grade aware session planning for every coach.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="bg-accent text-primary px-8 py-3 rounded-full font-bold hover:opacity-90">
              Get Started
            </Link>
            <Link href="/auth/login" className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:opacity-90">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
