import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const API = 'http://localhost:8100'

const PLATFORMS = ['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok']
const PLATFORM_ICONS: Record<string, string> = {
  twitter: '𝕏', instagram: '📸', facebook: '👤', linkedin: '💼', tiktok: '🎵',
}

export default function Compose() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [accounts, setAccounts] = useState<any[]>([])
  const [scheduledAt, setScheduledAt] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/v1/accounts/`).then(r => r.json()).then(d => setAccounts(d.accounts || [])).catch(() => null)
  }, [])

  function togglePlatform(p: string) {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function handleSubmit(publish: boolean) {
    if (!content.trim()) return
    setPublishing(true)
    const accountIds = accounts.filter(a => selectedPlatforms.includes(a.platform)).map((a: any) => a.id)
    const payload = {
      content,
      platforms: selectedPlatforms,
      account_ids: accountIds,
      hashtags: content.match(/#\w+/g) || [],
      scheduled_at: !publish && scheduledAt ? scheduledAt : null,
    }
    const r = await fetch(`${API}/api/v1/posts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => r.json()).catch(() => null)

    if (r?.success && publish && r?.post?.id) {
      await fetch(`${API}/api/v1/posts/${r.post.id}/publish`, { method: 'POST' })
    }
    setPublishing(false)
    router.push('/')
  }

  return (
    <>
      <Head><title>Yeni Gönderi — Sosyal Medya Yönetim</title></Head>
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-white mt-2 mb-6">Yeni Gönderi</h1>

          {/* Platform seçimi */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
            <p className="text-slate-400 text-sm mb-3">Platform Seç</p>
            <div className="flex gap-3 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => togglePlatform(p)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedPlatforms.includes(p)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}>
                  <span>{PLATFORM_ICONS[p]}</span>
                  <span className="capitalize">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* İçerik */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); setCharCount(e.target.value.length) }}
              placeholder="Ne paylaşmak istiyorsunuz? #hashtag @mention desteklenir..."
              rows={6}
              className="w-full bg-transparent text-white text-base outline-none resize-none placeholder-slate-600"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
              <div className="flex gap-2">
                {(content.match(/#\w+/g) || []).map((tag: string) => (
                  <span key={tag} className="text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <span className={`text-xs ${charCount > 280 ? 'text-red-400' : 'text-slate-500'}`}>{charCount}/280</span>
            </div>
          </div>

          {/* Zamanlama */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
            <p className="text-slate-400 text-sm mb-3">📅 Zamanlama (opsiyonel)</p>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500 w-full" />
          </div>

          {/* Butonlar */}
          <div className="flex gap-3">
            <button onClick={() => handleSubmit(false)} disabled={publishing || !content.trim()}
              className="flex-1 border border-slate-700 hover:border-slate-600 text-slate-300 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40">
              {scheduledAt ? '📅 Zamanla' : '💾 Taslak Kaydet'}
            </button>
            <button onClick={() => handleSubmit(true)} disabled={publishing || !content.trim() || selectedPlatforms.length === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40">
              {publishing ? 'Yayınlanıyor...' : '🚀 Hemen Yayınla'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
