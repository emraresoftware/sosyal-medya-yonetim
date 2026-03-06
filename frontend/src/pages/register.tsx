import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Ad gerekli'
    if (!form.lastName.trim()) e.lastName = 'Soyad gerekli'
    if (!form.email.includes('@')) e.email = 'Geçerli e-posta girin'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e: Record<string, string> = {}
    if (form.password.length < 6) e.password = 'En az 6 karakter'
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Şifreler eşleşmiyor'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    localStorage.setItem('sm_user', JSON.stringify({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      company: form.company,
      role: form.role,
      registeredAt: new Date().toISOString(),
    }))
    localStorage.removeItem('sm_onboarding_done')
    setLoading(false)
    router.push('/onboarding')
  }

  const ROLES = ['Pazarlama Müdürü', 'Sosyal Medya Uzmanı', 'İşletme Sahibi', 'İçerik Üreticisi', 'Freelancer', 'Ajans']

  return (
    <>
      <Head><title>Üye Ol — Sosyal Medya Yönetim</title></Head>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-4xl">📱</span>
            <h1 className="text-2xl font-bold text-white mt-3">SosyalApp</h1>
            <p className="text-slate-400 text-sm mt-1">Tüm sosyal medyanızı bir yerden yönetin</p>
          </div>

          {/* Adım göstergesi */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                }`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-slate-800'}`} />}
              </div>
            ))}
            <div className="text-slate-400 text-xs ml-2">
              {step === 1 ? 'Kişisel bilgiler' : 'Güvenlik'}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            {/* Adım 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-white text-lg mb-2">Sizi tanıyalım</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Ad *</label>
                    <input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                      placeholder="Emre"
                      className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500 ${errors.firstName ? 'border-red-500' : 'border-slate-700'}`} />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Soyad *</label>
                    <input value={form.lastName} onChange={e => set('lastName', e.target.value)}
                      placeholder="Yılmaz"
                      className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500 ${errors.lastName ? 'border-red-500' : 'border-slate-700'}`} />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">E-posta *</label>
                  <input value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="emre@sirket.com" type="email"
                    className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500 ${errors.email ? 'border-red-500' : 'border-slate-700'}`} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Şirket / Marka</label>
                  <input value={form.company} onChange={e => set('company', e.target.value)}
                    placeholder="Emare Digital"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500" />
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Unvanınız</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map(r => (
                      <button key={r} type="button" onClick={() => set('role', r)}
                        className={`text-xs py-2 px-2 rounded-lg border transition-all text-center ${
                          form.role === r
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}>{r}</button>
                    ))}
                  </div>
                </div>

                <button onClick={() => validateStep1() && setStep(2)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold text-sm mt-2 transition-colors">
                  Devam Et →
                </button>
              </div>
            )}

            {/* Adım 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-semibold text-white text-lg mb-2">Şifre oluşturun</h2>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Şifre *</label>
                  <input value={form.password} onChange={e => set('password', e.target.value)}
                    type="password" placeholder="En az 6 karakter"
                    className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500 ${errors.password ? 'border-red-500' : 'border-slate-700'}`} />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Şifre Tekrar *</label>
                  <input value={form.passwordConfirm} onChange={e => set('passwordConfirm', e.target.value)}
                    type="password" placeholder="Şifreyi tekrar girin"
                    className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500 ${errors.passwordConfirm ? 'border-red-500' : 'border-slate-700'}`} />
                  {errors.passwordConfirm && <p className="text-red-400 text-xs mt-1">{errors.passwordConfirm}</p>}
                </div>

                {/* Özet */}
                <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {form.firstName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{form.firstName} {form.lastName}</p>
                    <p className="text-slate-400 text-xs">{form.email}</p>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="ml-auto text-slate-500 hover:text-slate-300 text-xs">Düzenle</button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  {loading ? 'Hesap oluşturuluyor...' : '🚀 Hesabı Oluştur'}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-slate-500 text-sm mt-4">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Giriş yapın</Link>
          </p>
        </div>
      </div>
    </>
  )
}
