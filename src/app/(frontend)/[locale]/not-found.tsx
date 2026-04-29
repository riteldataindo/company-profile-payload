import Link from 'next/link'
import { Home, MessageCircle, Sparkles, CreditCard, FileText, Play } from 'lucide-react'

const quickLinks = [
  { href: '/en/features', icon: Sparkles, label: 'Features' },
  { href: '/en/packages', icon: CreditCard, label: 'Packages' },
  { href: '/en/blog', icon: FileText, label: 'Blog' },
  { href: '/en/demo', icon: Play, label: 'Demo' },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-md">
          <div className="font-mono text-[10rem] font-bold leading-none text-primary-600/10 select-none mb-[-2rem]">404</div>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">Page Not Found</p>
          <h1 className="text-2xl font-bold mb-2">This page doesn&apos;t exist</h1>
          <p className="text-text-secondary mb-8">The page you&apos;re looking for might have been moved, deleted, or never existed.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Link href="/en" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700">
              <Home size={16} /> Go to Homepage
            </Link>
            <Link href="/en/contact" className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-5 py-2.5 text-sm font-semibold text-primary-500 transition-all hover:bg-primary-600/10">
              <MessageCircle size={16} /> Contact Us
            </Link>
          </div>
          <p className="text-xs text-text-muted mb-3">You might be looking for:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(l => (
              <Link key={l.label} href={l.href} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-4 text-xs font-medium text-text-secondary transition-all hover:text-text-primary hover:border-primary-500/20 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <l.icon size={20} className="text-primary-500" />{l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
