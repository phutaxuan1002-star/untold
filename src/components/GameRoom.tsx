"use client";
import { useEffect,useState,useCallback,useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft,Copy,Check,Share2,RotateCcw,Users,WifiOff,QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Brand } from './Brand';
import { GameCard } from './GameCard';
import { getCard, TOTAL_CARDS } from '@/data/questions';
import { ensureGuest, prettyError } from '@/lib/supabase';
import { inviteUrl, rpc, type RoomState } from '@/lib/game';
export function GameRoom({roomCode}:{roomCode:string}){
 const [client,setClient]=useState<SupabaseClient|null>(null);const [state,setState]=useState<RoomState|null>(null);
 const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(''),[copied,setCopied]=useState(false),[qr,setQr]=useState(false),[online,setOnline]=useState(1),[disconnected,setDisconnected]=useState(false);
 const [cardId,setCardId]=useState<string|null>(null);const [flipping,setFlipping]=useState(false);
 const requestGuard=useRef(false);const requestEpoch=useRef(0);const currentCycle=useRef<number|null>(null);
 const refresh=useCallback(async(c:SupabaseClient,withCard=true)=>{const snapshot=await rpc<RoomState>(c,'get_room_state',{p_code:roomCode});setState(snapshot);if(currentCycle.current!==null&&currentCycle.current!==snapshot.cycle){requestEpoch.current++;setCardId(null);setFlipping(false);}currentCycle.current=snapshot.cycle;if(withCard)setCardId(snapshot.current_card);setDisconnected(false);return snapshot;},[roomCode]);
 useEffect(()=>{let cancelled=false;let c:SupabaseClient|null=null;async function init(){try{c=await ensureGuest();if(cancelled)return;setClient(c);try{await rpc(c,'join_room',{p_code:roomCode});}catch(e){throw e;}if(cancelled)return;await refresh(c);if(!cancelled)setLoading(false)}catch(e){if(!cancelled){setError(prettyError(e));setLoading(false)}}}init();return()=>{cancelled=true}},[roomCode,refresh]);
 useEffect(()=>{if(!client||!state)return;let active=true;const channel=client.channel(`presence-${roomCode}`,{config:{presence:{key:crypto.randomUUID()}}});
 channel.on('presence',{event:'sync'},()=>{if(active)setOnline(Math.max(1,Object.keys(channel.presenceState()).length))});
 channel.on('postgres_changes',{event:'UPDATE',schema:'public',table:'rooms',filter:`room_code=eq.${roomCode}`},()=>{if(active)refresh(client,false).catch(()=>setDisconnected(true))});
 channel.subscribe(async(status)=>{if(!active)return;if(status==='SUBSCRIBED'){await channel.track({online_at:new Date().toISOString()});refresh(client,false).catch(()=>setDisconnected(true))}else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')setDisconnected(true)});
 const poll=setInterval(()=>{if(active)refresh(client,false).catch(()=>setDisconnected(true))},10000);
 const onVisible=()=>{if(document.visibilityState==='visible'&&active)refresh(client,true).catch(()=>setDisconnected(true))};document.addEventListener('visibilitychange',onVisible);
 return()=>{active=false;clearInterval(poll);document.removeEventListener('visibilitychange',onVisible);client.removeChannel(channel);};},[client,roomCode,refresh,Boolean(state)]);
 async function draw(){if(!client||!state||requestGuard.current)return;requestGuard.current=true;setBusy(true);setError('');const epoch=++requestEpoch.current;const oldCycle=state.cycle;
 try {const id=await rpc<string|null>(client,'draw_card',{p_code:roomCode,p_cycle:oldCycle});if(epoch!==requestEpoch.current)return;if(id){setFlipping(true);setCardId(null);setTimeout(()=>{if(epoch===requestEpoch.current){setCardId(id);setFlipping(false)}},280)}await refresh(client,false)}catch(e){if(epoch===requestEpoch.current){setError(prettyError(e));refresh(client,true).catch(()=>{})}}finally{requestGuard.current=false;setBusy(false)}}
 async function reset(){if(!client||!state)return;if(!window.confirm('Đặt lại toàn bộ 15 thẻ cho tất cả thành viên?'))return;setBusy(true);setError('');try{await rpc(client,'reset_room',{p_code:roomCode});requestEpoch.current++;setCardId(null);await refresh(client,true)}catch(e){setError(prettyError(e))}finally{setBusy(false)}}
 async function copy(){try{await navigator.clipboard.writeText(inviteUrl(roomCode));setCopied(true);setTimeout(()=>setCopied(false),2000)}catch{setError('Không thể sao chép. Vui lòng copy đường dẫn từ thanh địa chỉ.')}}
 async function share(){if(navigator.share){try{await navigator.share({title:'Untold',url:inviteUrl(roomCode)})}catch{}}else await copy()}
 if(loading)return <div className="min-h-screen flex items-center justify-center text-neutral-500" role="status">Đang kết nối phòng chơi...</div>;
 if(!state)return <div className="min-h-screen flex flex-col gap-5 items-center justify-center p-6 text-center"><h1 className="text-2xl font-bold">Không thể vào phòng</h1><p role="alert" className="text-red-600 max-w-md">{error}</p><Link href="/" className="btn">Về trang chủ</Link></div>;
 const complete=state.count===TOTAL_CARDS;
 return <main className="site-shell min-h-screen">
   <header className="site-header flex justify-between gap-4 items-center">
     <Brand/><Link href="/" className="room-aux inline-flex items-center gap-2"><ArrowLeft size={17}/> Leave Room</Link>
   </header>
   <section className="room-layout">
     <aside className="room-side">
       <div className="clay-surface room-info">
         <p className="room-label mb-3">YOUR ROOM</p>
         <div className="flex items-center justify-between gap-2">
           <span className="room-code">{roomCode}</span>
           <button aria-label="Copy invite link" onClick={copy} className="small-clay-button p-3">{copied?<Check size={19}/>:<Copy size={19}/>}</button>
         </div>
         <p className="text-sm mt-3 opacity-80">Share this code with your team.</p>
         <div className="flex gap-2 mt-5 flex-wrap">
           <button onClick={share} className="small-clay-button text-sm"><Share2 size={15}/> Share</button>
           <button onClick={()=>setQr(!qr)} aria-expanded={qr} className="small-clay-button text-sm"><QrCode size={15}/> QR</button>
         </div>
         {qr&&<div className="mt-5 flex justify-center rounded-[25px] bg-[#fffdf7] p-5"><QRCodeSVG value={inviteUrl(roomCode)} size={155}/></div>}
       </div>
       <div className="mt-5 flex items-center gap-2 room-aux px-3"><Users size={17}/> {online} participant{online!==1?'s':''} connected</div>
       {disconnected&&<div className="mt-3 text-amber-800 flex items-center gap-2 text-sm px-3"><WifiOff size={16}/> Đang kết nối lại...</div>}
     </aside>
     <section className="room-main">
       <div className="game-card-wrap"><GameCard card={cardId?getCard(cardId):null}/></div>
       <div className="game-action">
         <button className="btn primary flex items-center justify-center gap-3" onClick={draw} disabled={busy||complete||flipping}>
           {busy||flipping?'Đang bốc thẻ...':complete?'Đã hết thẻ':cardId?'Draw Another Card →':'Draw Card →'}
         </button>
         {error&&<p role="alert" className="error-text text-center mt-4">{error}</p>}
       </div>
       {complete&&<div className="clay-surface clay-complete">
         <div className="text-3xl mb-2" aria-hidden="true">✳</div>
         <p className="font-bold">Bạn đã khám phá hết tất cả thẻ bài!</p>
         <p className="text-sm mt-2">All cards have been discovered! · 15/15</p>
         {state.host&&<button className="mt-5 btn secondary flex items-center justify-center gap-2 w-full" onClick={reset} disabled={busy}><RotateCcw size={17}/> Reset Deck</button>}
       </div>}
     </section>
     <aside className="room-help">
       <div className="clay-surface how-to-play">
         <p className="text-sm font-extrabold">HOW TO PLAY</p>
         <ol className="list-decimal"><li>Share your room code with the team.</li><li>Everyone can draw their own random card.</li><li>Read your question and start talking.</li></ol>
       </div>
       {state.host&&<button onClick={reset} disabled={busy} className="room-aux px-2 mt-6 flex items-center gap-2"><RotateCcw size={15}/> Reset shared deck</button>}
     </aside>
   </section>
 </main>;
}
