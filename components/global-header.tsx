import { BarChart3 } from "lucide-react"
import Link from "next/link"

export function GlobalHeader() {
  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-2xl">
          Acme
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link
            href="/analytics"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </nav>
        <div className="md:hidden">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Hidden by default) */}
      <div className="border-b md:hidden">
        <div className="container py-2 space-y-1">
          <Link
            href="/"
            className="block px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Home
          </Link>
          <Link
            href="/analytics"
            className="block px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            📊 Analytics Dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}
