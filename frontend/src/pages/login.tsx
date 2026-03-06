import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('sm_user') && localStorage.getItem('sm_onboarding_done')) {
      router.push('/')
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const stored = localStorage.getItem('sm_user')
    if (!stored) { setError('Hesap bulunamadı. Önce kayıt olun.'); return }
    const user = JSON.parse(stored)
    if (user.email !== form.email) { setError('E-posta adresi bulunamadı.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    if (!localStorage.getItem('sm_onboarding_done')) {
      router.push('/onboarding')
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <Head><title>Giriş Yap — SosyalApp</title></Head>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-4xl">📱</span>
            <h1 className="text-2xl font-bold text-white mt-3">Tekrar hoş geldiniz</h1>
            <p className="text-slate-400 text-sm mt-1">Hesabınıza giriş yapın</p>
          </div>

          <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-1">E-posta</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                type="email" placeholder="emre@sirket.com" required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Şifre</label>
              <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                type="password" placeholder="••••••••" required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500" />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-4">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Üye olun</Link>
          </p>
        </div>
      </div>
    </>
  )
}
