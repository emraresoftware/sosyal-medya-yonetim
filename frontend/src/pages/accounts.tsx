import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const API = 'http://localhost:8100'

const PLATFORMS = [
  { id: 'twitter',   name: 'X (Twitter)',  icon: '𝕏',  color: '#000' },
  { id: 'instagram', name: 'Instagram',    icon: '📸', color: '#E1306C' },
  { id: 'facebook',  name: 'Facebook',     icon: '👤', color: '#1877F2' },
  { id: 'linkedin',  name: 'LinkedIn',     icon: '💼', color: '#0A66C2' },
  { id: 'tiktok',    name: 'TikTok',       icon: '🎵', color: '#010101' },
  { id: 'youtube',   name: 'YouTube',      icon: '▶️', color: '#FF0000' },
]

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ platform: 'instagram', username: '', followers: '' })
  const [loading, setLoading] = useState(false)

  async function fetchAccounts() {
    const r = await fetch(`${API}/api/v1/accounts/`).then(r => r.json()).catch(() => ({ accounts: [] }))
    setAccounts(r.accounts || [])
  }

  useEffect(() => { fetchAccounts() }, [])

  async function addAccount(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch(`${API}/api/v1/accounts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, followers: parseInt(form.followers || '0') }),
    })
    setForm({ platform: 'instagram', username: '', followers: '' })
    setShowForm(false)
    setLoading(false)
    fetchAccounts()
  }

  async function deleteAccount(id: string) {
    await fetch(`${API}/api/v1/accounts/${id}`, { method: 'DELETE' })
    fetchAccounts()
  }

  return (
    <>
      <Head><title>Hesaplar — Sosyal Medya Yönetim</title></Head>
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-white mt-2">Bağlı Hesaplar</h1>
            </div>
            <button onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              + Hesap Ekle
            </button>
          </div>

          {/* Hesap Ekleme Formu */}
          {showForm && (
            <form onSubmit={addAccount} className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-white mb-4">Yeni Hesap Ekle</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Platform</label>
                  <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none">
                    {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Kullanıcı Adı</label>
                  <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                    placeholder="@kullanici" required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Takipçi Sayısı</label>
                  <input value={form.followers} onChange={e => setForm({...form, followers: e.target.value})}
                    placeholder="0" type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                  {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white text-sm px-4 py-2">İptal</button>
              </div>
            </form>
          )}

          {/* Platform kartları (boşsa) */}
          {accounts.length === 0 && !showForm && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => { setForm({...form, platform: p.id}); setShowForm(true) }}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 text-center transition-all">
                  <span className="text-3xl block">{p.icon}</span>
                  <p className="text-white font-medium text-sm mt-2">{p.name}</p>
                  <p className="text-slate-500 text-xs mt-1">Bağla</p>
                </button>
              ))}
            </div>
          )}

          {/* Hesap listesi */}
          <div className="space-y-3">
            {accounts.map((a: any) => {
              const pl = PLATFORMS.find(p => p.id === a.platform)
              return (
                <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                  <span className="text-3xl">{pl?.icon || '🌐'}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium">@{a.username}</p>
                    <p className="text-slate-500 text-sm">{pl?.name} · {a.followers.toLocaleString()} takipçi</p>
                  </div>
                  <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-1 rounded-full">Aktif</span>
                  <button onClick={() => deleteAccount(a.id)} className="text-slate-600 hover:text-red-400 text-sm transition-colors">✕</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
