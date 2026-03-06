import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const API = 'http://localhost:8100'

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  published: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  draft: 'bg-slate-700/50 text-slate-400 border-slate-600/30',
  failed: 'bg-red-500/20 text-red-300 border-red-500/30',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Pazartesi başlangıç
}

export default function Calendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [posts, setPosts] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/api/v1/posts/`).then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => null)
  }, [])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  function postsForDay(day: number) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return posts.filter(p => p.scheduled_at?.startsWith(date))
  }

  const monthNames = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
  }

  const selectedPosts = selected ? postsForDay(parseInt(selected)) : []

  return (
    <>
      <Head><title>Takvim — Sosyal Medya Yönetim</title></Head>
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-white mt-2">İçerik Takvimi</h1>
            </div>
            <Link href="/compose"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              + Yeni Gönderi
            </Link>
          </div>

          {/* Takvim */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {/* Başlık */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 transition-colors">‹</button>
              <h2 className="text-white font-semibold text-lg">{monthNames[month]} {year}</h2>
              <button onClick={nextMonth} className="text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 transition-colors">›</button>
            </div>

            {/* Gün başlıkları */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-slate-500 text-xs font-medium py-2">{d}</div>
              ))}
            </div>

            {/* Günler */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayPosts = postsForDay(day)
                const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()
                const isSelected = selected === String(day)
                return (
                  <button key={day} onClick={() => setSelected(isSelected ? null : String(day))}
                    className={`min-h-[70px] p-2 rounded-xl text-left transition-all ${
                      isSelected ? 'bg-indigo-600/20 border border-indigo-500/50' :
                      isToday ? 'bg-indigo-600/10 border border-indigo-500/20' :
                      'hover:bg-slate-800 border border-transparent'
                    }`}>
                    <span className={`text-xs font-medium ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {dayPosts.slice(0, 2).map(p => (
                        <div key={p.id} className={`text-xs px-1.5 py-0.5 rounded border text-left line-clamp-1 ${STATUS_COLORS[p.status] || STATUS_COLORS.draft}`}>
                          {p.content?.slice(0, 20) || 'Gönderi'}
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <span className="text-slate-500 text-xs">+{dayPosts.length - 2} daha</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Seçili gün detayı */}
          {selected && selectedPosts.length > 0 && (
            <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">{monthNames[month]} {selected} — Gönderiler</h3>
              <div className="space-y-3">
                {selectedPosts.map(p => (
                  <div key={p.id} className="p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex gap-2 mb-2">
                          {(p.platforms || []).map((pl: string) => (
                            <span key={pl} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{pl}</span>
                          ))}
                          <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[p.status] || ''}`}>{p.status}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{p.content}</p>
                        <p className="text-slate-500 text-xs mt-1">
                          {p.scheduled_at ? new Date(p.scheduled_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
