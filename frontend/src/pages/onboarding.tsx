import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const MODULES = [
  {
    id: 'accounts',
    icon: '🔗',
    title: 'Çoklu Hesap Yönetimi',
    desc: 'Twitter, Instagram, Facebook, LinkedIn, TikTok ve YouTube hesaplarınızı tek yerden bağlayın ve yönetin.',
    tags: ['twitter', 'instagram', 'linkedin'],
    color: 'from-indigo-500/20',
  },
  {
    id: 'compose',
    icon: '✍️',
    title: 'İçerik Oluşturucu',
    desc: 'Tek seferde birden fazla platforma gönderi yazın, hashtag önerileri alın, taslak kaydedin.',
    tags: ['#hashtag', '@mention', 'emoji'],
    color: 'from-violet-500/20',
  },
  {
    id: 'calendar',
    icon: '📅',
    title: 'İçerik Takvimi',
    desc: 'Aylık takvim görünümüyle tüm gönderilerinizi planlayın. Sürükle-bırak ile kolayca taşıyın.',
    tags: ['zamanlama', 'plan', 'takvim'],
    color: 'from-blue-500/20',
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Analitik & Raporlama',
    desc: 'Takipçi büyümesi, etkileşim oranı ve en iyi performanslı içeriklerinizi izleyin.',
    tags: ['trend', 'büyüme', 'rapor'],
    color: 'from-emerald-500/20',
  },
  {
    id: 'schedule',
    icon: '⏰',
    title: 'Otomatik Zamanlama',
    desc: 'En iyi paylaşım saatlerini otomatik tespit edin ve gönderilerinizi en etkili zamanda yayınlayın.',
    tags: ['otomasyon', 'en iyi saat'],
    color: 'from-amber-500/20',
  },
  {
    id: 'media',
    icon: '🖼️',
    title: 'Medya Kütüphanesi',
    desc: 'Görsel ve videolarınızı yükleyin, organize edin. Her platform için otomatik boyutlandırma.',
    tags: ['görsel', 'video', 'reels'],
    color: 'from-rose-500/20',
  },
]

export default function Onboarding() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<string[]>(['accounts', 'compose', 'calendar'])
  const [step, setStep] = useState(0) // 0: hoşgeldin, 1: modüller, 2: bitti
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('sm_user')
    if (!u) { router.push('/register'); return }
    setUser(JSON.parse(u))
    // Onboarding zaten yapıldıysa dashboard'a gönder
    if (localStorage.getItem('sm_onboarding_done')) router.push('/')
  }, [])

  function toggleModule(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function finish() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    localStorage.setItem('sm_modules', JSON.stringify(selected))
    localStorage.setItem('sm_onboarding_done', '1')
    setSaving(false)
    router.push('/')
  }

  if (!user) return null

  return (
    <>
      <Head><title>Hoş Geldiniz — SosyalApp</title></Head>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">

          {/* Adım 0: Hoşgeldin */}
          {step === 0 && (
            <div className="text-center">
              <span className="text-6xl block mb-6">🎉</span>
              <h1 className="text-3xl font-bold text-white mb-3">
                Hoş geldin, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-slate-400 text-lg mb-2">Hesabın oluşturuldu.</p>
              {user.company && (
                <p className="text-indigo-400 text-sm mb-8">🏢 {user.company}</p>
              )}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 text-left">
                <p className="text-slate-300 text-sm leading-relaxed">
                  SosyalApp ile tüm sosyal medya hesaplarını tek panelden yönetebilirsin.
                  Sana hangi özelliklerin gerektiğini öğrenmek istiyorum — böylece panelini
                  ihtiyacına göre düzenleriz. <span className="text-white font-medium">Sadece 1 dakika sürecek.</span>
                </p>
              </div>
              <button onClick={() => setStep(1)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-semibold text-base transition-colors">
                Hadi Başlayalım →
              </button>
              <button onClick={finish} className="block mx-auto mt-4 text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Şimdi değil, direkt geç
              </button>
            </div>
          )}

          {/* Adım 1: Modüller */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">Hangi özellikleri kullanmak istersin?</h2>
                <p className="text-slate-400 text-sm mt-2">İstediğini seç, sonradan değiştirebilirsin</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {MODULES.map(m => {
                  const isSelected = selected.includes(m.id)
                  return (
                    <button key={m.id} onClick={() => toggleModule(m.id)}
                      className={`relative text-left p-5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-indigo-500/60 bg-indigo-600/10'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}>
                      {/* Seçim işareti */}
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-slate-600'
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>

                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} to-slate-900 mb-3`}>
                        <span className="text-xl">{m.icon}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">{m.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{m.desc}</p>
                      <div className="flex gap-1 mt-3 flex-wrap">
                        {m.tags.map(t => (
                          <span key={t} className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Alt bilgi */}
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm">
                  {selected.length} özellik seçildi
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setSelected(MODULES.map(m => m.id))}
                    className="text-slate-400 hover:text-white text-sm transition-colors">Tümünü Seç</button>
                  <button onClick={finish} disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                    {saving ? 'Kaydediliyor...' : selected.length === 0 ? 'Geç →' : 'Paneli Hazırla →'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
