import React, { useEffect, useMemo, useState } from 'react'
import { getLoginUrl, getLogoutUrl, exchangeCodeForTokens, getTokens, saveTokens, clearTokens } from './auth'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export default function Admin() {
  const [tokens, setTokens] = useState(getTokens())
  const [form, setForm] = useState({ name: '', number: '', position: 'Defender', bio: '', imageKey: '' })
  const [players, setPlayers] = useState([])
  const [busy, setBusy] = useState(false)

  // Handle OAuth redirect
  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    if (code && !tokens) {
      exchangeCodeForTokens(code).then(t => { saveTokens(t); setTokens(t); window.history.replaceState({}, '', url.origin + url.pathname) }).catch(console.error)
    }
  }, [])

  const authHeader = useMemo(() => tokens && tokens.id_token ? { Authorization: `Bearer ${tokens.id_token}` } : {}, [tokens])

  const loadPlayers = async () => {
    const res = await fetch(`${API_BASE}/players`)
    setPlayers(await res.json())
  }

  useEffect(() => { loadPlayers().catch(console.error) }, [])

  const createPlayer = async () => {
    setBusy(true)
    const res = await fetch(`${API_BASE}/players`, { method: 'POST', headers: { 'content-type': 'application/json', ...authHeader }, body: JSON.stringify({ ...form, number: Number(form.number) }) })
    setBusy(false)
    if (res.ok) { setForm({ name: '', number: '', position: 'Defender', bio: '', imageKey: '' }); loadPlayers() }
  }

  const updatePlayer = async (p) => {
    setBusy(true)
    const res = await fetch(`${API_BASE}/players/${p.id}`, { method: 'PUT', headers: { 'content-type': 'application/json', ...authHeader }, body: JSON.stringify(p) })
    setBusy(false)
    if (res.ok) loadPlayers()
  }

  const deletePlayer = async (p) => {
    setBusy(true)
    const res = await fetch(`${API_BASE}/players/${p.id}`, { method: 'DELETE', headers: { ...authHeader } })
    setBusy(false)
    if (res.status === 204) setPlayers(players.filter(x => x.id !== p.id))
  }

  const signUpload = async (file) => {
    const key = `players/${Date.now()}_${file.name}`
    const res = await fetch(`${API_BASE}/uploads/sign`, { method: 'POST', headers: { 'content-type': 'application/json', ...authHeader }, body: JSON.stringify({ key, contentType: file.type }) })
    const { url } = await res.json()
    await fetch(url, { method: 'PUT', headers: { 'content-type': file.type }, body: file })
    setForm(prev => ({ ...prev, imageKey: key }))
  }

  if (!tokens) {
    return (
      <div className="p-4">
        <a className="px-3 py-2 bg-black text-white rounded" href={getLoginUrl()}>Admin Login</a>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Console</h1>
        <a className="text-sm text-red-600" href={getLogoutUrl()} onClick={() => clearTokens()}>Logout</a>
      </div>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Create Player</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Number" value={form.number} onChange={e=>setForm({...form, number:e.target.value})} />
          <select className="border rounded px-3 py-2" value={form.position} onChange={e=>setForm({...form, position:e.target.value})}>
            <option>Goalkeeper</option>
            <option>Defender</option>
            <option>Midfielder</option>
            <option>Forward</option>
          </select>
          <input className="border rounded px-3 py-2" placeholder="Image key" value={form.imageKey} onChange={e=>setForm({...form, imageKey:e.target.value})} />
          <textarea className="border rounded px-3 py-2 sm:col-span-2" placeholder="Bio" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} />
          <input className="sm:col-span-2" type="file" accept="image/*" onChange={e=> e.target.files && signUpload(e.target.files[0])} />
        </div>
        <button disabled={busy} className="mt-3 px-3 py-2 bg-blue-600 text-white rounded" onClick={createPlayer}>Create</button>
      </section>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Existing Players</h2>
        <div className="space-y-3">
          {players.map(p => (
            <div key={p.id} className="border rounded p-3">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                <input className="border rounded px-2 py-1 sm:col-span-2" value={p.name} onChange={e=>setPlayers(prev=>prev.map(x=>x.id===p.id?{...x,name:e.target.value}:x))} />
                <input className="border rounded px-2 py-1" value={p.number} onChange={e=>setPlayers(prev=>prev.map(x=>x.id===p.id?{...x,number:Number(e.target.value)}:x))} />
                <select className="border rounded px-2 py-1" value={p.position} onChange={e=>setPlayers(prev=>prev.map(x=>x.id===p.id?{...x,position:e.target.value}:x))}>
                  <option>Goalkeeper</option>
                  <option>Defender</option>
                  <option>Midfielder</option>
                  <option>Forward</option>
                </select>
                <button disabled={busy} className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>updatePlayer(p)}>Save</button>
                <button disabled={busy} className="px-3 py-2 bg-red-600 text-white rounded" onClick={()=>deletePlayer(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


