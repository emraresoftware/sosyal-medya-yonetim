import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const API = 'http://localhost:8100'

export default function Analytics() {
  const [overview, setOverview] = useState<any>(null)
  const [platforms, setPlatforms] = useState<any[]>([])

  useEffect(() => {
    fetch(`${API}/api/v1/analytics/overview`).then(r => r.json()).then(setOverview).catch(() => null)
    fetch(`${API}/api/v1/analytics/platforms`).then(r => r.json()).then(d => setPlatforms(d.platforms || [])).catch(() => null)
  }, [])

  return (
    <>
      <Head><title>Analitik — Sosyal Medya Yönetim</title></Head>
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-white mt-2 mb-8">Analitik</h1>

          {/* Genel bakış */}
          {overview && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Toplam Gönderi', value: overview.total_posts },
                { label: 'Yayınlanan', value: overview.published },
                { label: 'Zamanlanmış', value: overview.scheduled },
                { label: 'Taslak', value: overview.drafts },
                { label: 'Toplam Takipçi', value: overview.total_followers?.toLocaleString() },
                { label: 'Ort. Etkileşim', value: overview.engagement_rate },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-2xl font-bold text-white">{s.value ?? '—'}</p>
                  <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Platform dağılımı */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Platform Dağılımı</h2>
            {platforms.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">Henüz veri yok</p>
            ) : (
              <div className="space-y-3">
                {platforms.map((p: any) => (
                  <div key={p.platform} className="flex items-center gap-4">
                    <span className="text-slate-300 capitalize w-24 text-sm">{p.platform}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min((p.posts / (overview?.total_posts || 1)) * 100, 100)}%` }} />
                    </div>
                    <span className="text-slate-400 text-sm w-16 text-right">{p.posts} gönderi</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
