"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Brand } from '@/components/Brand';
import { ensureGuest, prettyError } from '@/lib/supabase';
import { normalizeRoomCode, rpc } from '@/lib/game';
export default function Home() {
  const router=useRouter();
  const [mode,setMode]=useState<'home'|'join'>('home');
  const [code,setCode]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function create(){setBusy(true);setError('');try{const c=await ensureGuest();const room=await rpc<string>(c,'create_room');router.push(`/room/${room}`)}catch(e){setError(prettyError(e))}finally{setBusy(false)}}
  async function join(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{const c=await ensureGuest();const room=await rpc<string>(c,'join_room',{p_code:normalizeRoomCode(code)});router.push(`/room/${room}`)}catch(e){setError(prettyError(e))}finally{setBusy(false)}}
  return <main className="site-shell min-h-screen">
    <header className="site-header"><Brand/></header>
    <section className="clay-hero" aria-label="Welcome to Untold">
      <div className="hero-copy">
        <div className="eyebrow flex items-center gap-2"><Sparkles size={18}/> A LITTLE CURIOSITY GOES A LONG WAY</div>
        <h1 className="hero-title">Stories <span>untold.</span><br/>Connections<br/>unfold.</h1>
        <p className="hero-subtitle">Discover the people behind the team.</p>
        {mode==='home' ? <div className="hero-actions">
          <button disabled={busy} onClick={create} className="btn primary flex items-center justify-center gap-3">{busy?'Đang tạo phòng...':'Create Room'} <ArrowRight size={19}/></button>
          <button disabled={busy} onClick={()=>setMode('join')} className="btn secondary">Join Room</button>
        </div> : <form className="join-form" onSubmit={join}>
          <input aria-label="Room code" autoFocus required maxLength={8} value={code} onChange={e=>setCode(normalizeRoomCode(e.target.value))} placeholder="ROOM CODE" className="clay-input"/>
          <button disabled={busy||!code} className="btn primary">{busy?'Đang vào...':'Join →'}</button>
          <button type="button" className="text-sm font-semibold underline underline-offset-4" onClick={()=>setMode('home')}>Back</button>
        </form>}
        {error&&<p role="alert" className="error-text mt-5">{error}</p>}
      </div>
      <div className="hero-sculpture" aria-hidden="true">
        <div className="clay-blob clay-blob-mint"/><div className="clay-blob clay-blob-yellow"/><div className="clay-blob clay-blob-blue"/>
        <div className="hero-card-shadow"/>
        <div className="hero-card"><div className="hero-card-emblem"><span>✳</span></div><div className="hero-card-wordmark">UNTOLD</div></div>
      </div>
    </section>
  </main>;
}
