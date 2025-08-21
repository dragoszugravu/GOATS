import React, { useEffect, useMemo, useState } from 'react'
import Admin from './Admin.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export default function App() {
  const [players, setPlayers] = useState([])
  const [q, setQ] = useState('')
  const [position, setPosition] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const fetchPlayers = async () => {
      setLoading(true)
      const url = new URL(`${API_BASE}/players`)
      if (position) url.searchParams.set('position', position)
      if (q) url.searchParams.set('q', q)
      const res = await fetch(url, { signal: controller.signal })
      const data = await res.json()
      setPlayers(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchPlayers().catch(() => setLoading(false))
    return () => controller.abort()
  }, [q, position])

  const grouped = useMemo(() => {
    const byPos = { Goalkeeper: [], Defender: [], Midfielder: [], Forward: [] }
    for (const p of players) {
      if (byPos[p.position]) byPos[p.position].push(p)
    }
    return byPos
  }, [players])

  return (
    <div className="mx-auto max-w-4xl p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">GOATS Roster</h1>
        <div className="mt-2"><a href="#admin" className="text-sm text-blue-700 underline">Admin</a></div>
        <div className="mt-4 flex gap-2">
          <input className="border rounded px-3 py-2 w-full" placeholder="Search by name or number" value={q} onChange={e => setQ(e.target.value)} />
          <select className="border rounded px-3 py-2" value={position} onChange={e => setPosition(e.target.value)}>
            <option value="">All</option>
            <option>Goalkeeper</option>
            <option>Defender</option>
            <option>Midfielder</option>
            <option>Forward</option>
          </select>
        </div>
      </header>

      {loading ? <p>Loading...</p> : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([pos, list]) => (
            <section key={pos}>
              <h2 className="text-xl font-semibold mb-2">{pos}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map(p => (
                  <div key={p.id} className="border rounded p-3">
                    <div className="font-semibold">#{p.number} {p.name}</div>
                    {p.bio && <p className="text-sm mt-1 line-clamp-3">{p.bio}</p>}
                  </div>
                ))}
                {list.length === 0 && <div className="text-sm text-gray-500">No players</div>}
              </div>
            </section>
          ))}
        </div>
      )}
      <div id="admin" className="mt-12">
        <Admin />
      </div>
    </div>
  )
}


