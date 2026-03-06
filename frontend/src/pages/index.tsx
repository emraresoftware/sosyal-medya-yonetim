import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const API = 'http://localhost:8100'

interface Overview {
  accounts: number
  total_posts: number
  published: number
  scheduled: number
  drafts: number
  total_followers: number
  engagement_rate: string
}

const NAV = [
  { icon: '🏠', label: 'Dashboard', href: '/' },
  { icon: '🔗', label: 'Hesaplar', href: '/accounts' },
  { icon: '✏️', label: 'Yeni Gönderi', href: '/compose' },
  { icon: '📅', label: 'Takvim', href: '/calendar' },
  { icon: '📊', label: 'Analitik', href: '/analytics' },
]

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Overview | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem('sm_user')
    if (!u) { router.push('/register'); return }
    if (!localStorage.getItem('sm_onboarding_done')) { router.push('/onboarding'); return }
    setUser(JSON.parse(u))
  }, [])

  useEffect(() => {
    fetch(`${API}/api/v1/analytics/overview`).then(r => r.json()).then(setStats).catch(() => null)
    fetch(`${API}/api/v1/posts/?status=scheduled`).then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => null)
  }, [])

  const STAT_CARDS = [
    { label: 'Bağlı Hesap', value: stats?.accounts ?? '-', icon: '🔗', color: 'from-indigo-500/20' },
    { label: 'Toplam Takipçi', value: stats?.total_followers?.toLocaleString() ?? '-', icon: '👥', color: 'from-violet-500/20' },
    { label: 'Zamanlanmış', value: stats?.scheduled ?? '-', icon: '📅', color: 'from-blue-500/20' },
    { label: 'Etkileşim', value: stats?.engagement_rate ?? '-', icon: '📈', color: 'from-emerald-500/20' },
  ]

  if (!user) return null

  function logout() {
    localStorage.clear()
    router.push('/register')
  }

  return (
    <>
      <Head><title>Dashboard — Sosyal Medya Yönetim</title></Head>
      <div className="min-h-screen bg-slate-950 flex">
        {/* Sidebar */}
        <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-3 fixed h-full">
          <div className="px-3 mb-6">
            <span className="text-xl font-bold text-white">📱 SosyalApp</span>
            <p className="text-slate-500 text-xs mt-0.5">Yönetim Paneli</p>
          </div>
          {/* Kullanıcı */}
          <div className="mx-3 mb-4 p-3 bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate">{user.name}</p>
                <p className="text-slate-500 text-xs truncate">{user.company || user.email}</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1 flex-1">
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm">
                <span>{n.icon}</span>{n.label}
              </Link>
            ))}
          </nav>
          <button onClick={logout}
            className="mx-3 mb-2 text-slate-500 hover:text-red-400 text-xs text-left px-3 py-2 transition-colors">
            ↩ Çıkış Yap
          </button>
          <Link href="/compose"
            className="mx-3 bg-indigo-600 hover:bg-indigo-500 text-white text-center py-2.5 rounded-xl text-sm font-semibold transition-colors">
            + Yeni Gönderi
          </Link>
        </aside>

        {/* Main */}
        <main className="ml-56 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Tüm platformlar bir arada</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} to-slate-900 border border-slate-800 rounded-2xl p-5`}>
                <span className="text-2xl">{s.icon}</span>
                <p className="text-2xl font-bold text-white mt-2">{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Zamanlanmış gönderiler */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Zamanlanmış Gönderiler</h2>
              <Link href="/calendar" className="text-indigo-400 hover:text-indigo-300 text-sm">Tümünü gör →</Link>
            </div>
            {posts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm">Henüz zamanlanmış gönderi yok</p>
                <Link href="/compose" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 block">
                  İlk gönderiyi oluştur →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex gap-1 mt-0.5">
                      {(p.platforms || []).map((pl: string) => (
                        <span key={pl} className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{pl}</span>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm line-clamp-1">{p.content}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        {p.scheduled_at ? new Date(p.scheduled_at).toLocaleString('tr-TR') : 'Taslak'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
