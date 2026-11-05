'use client';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = { cardId: string; animated?: boolean };
const c = { ink:'#383139',pink:'#f6a3ca',mint:'#c0efdc',lav:'#ded0f9',yellow:'#f9e7a8',blue:'#c5e5fb',cream:'#fffdf7',purple:'#9a83cb',coral:'#e58799',green:'#70b79b' };
const stroke={ stroke:c.ink,strokeWidth:4,strokeLinecap:'round' as const,strokeLinejoin:'round' as const };
function Motif({n}:{n:number}) {
 const outline={stroke:c.ink,strokeWidth:4,strokeLinejoin:'round' as const,strokeLinecap:'round' as const};
 const tile=(x:number,y:number,w:number,h:number,color:string,r=18)=><rect x={x} y={y} width={w} height={h} rx={r} fill={color} {...outline}/>;
 const line=(d:string,color=c.ink)=><path d={d} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>;
 switch(n){
 case 1:return <>{line('M65 165 L150 80 L240 165',c.purple)}{line('M145 80 L145 145')}{tile(36,158,68,42,c.pink)}{tile(212,158,68,42,c.mint)}{line('M122 145 L145 166 L168 145')}</>;
 case 2:return <>{tile(35,70,105,105,c.mint)}{tile(145,70,105,105,c.lav)}<circle cx="140" cy="122" r="22" fill={c.yellow} {...outline}/>{tile(110,175,70,40,c.pink)}</>;
 case 3:return <>{tile(75,25,170,195,c.yellow,70)}{tile(91,42,138,162,c.cream,55)}<circle cx="155" cy="108" r="39" fill={c.lav}/><path d="M105 162 Q160 120 212 162" fill="none" stroke={c.mint} strokeWidth="20"/></>;
 case 4:return <>{line('M45 185 C95 80 140 230 190 115 S250 65 280 65',c.coral)}<circle cx="278" cy="63" r="20" fill={c.mint} {...outline}/>{line('M268 63 L276 72 L289 54')}</>;
 case 5:return <><circle cx="157" cy="129" r="82" fill={c.blue} {...outline}/><path d="M100 104 L145 73 L163 102 L140 139 L109 136Z M175 150 L215 113 L231 150 L203 187Z" fill={c.mint}/>{line('M157 58 Q157 20 180 20',c.green)}<ellipse cx="189" cy="23" rx="24" ry="12" fill={c.mint} transform="rotate(-25 189 23)"/></>;
 case 6:return <>{tile(35,50,112,88,c.pink,38)}{tile(175,50,112,88,c.mint,38)}{line('M142 106 Q160 145 180 106',c.purple)}<circle cx="91" cy="94" r="13" fill={c.yellow}/><circle cx="229" cy="94" r="13" fill={c.yellow}/></>;
 case 7:return <><circle cx="112" cy="140" r="62" fill={c.yellow} {...outline}/><circle cx="112" cy="140" r="40" fill={c.cream} {...outline}/>{tile(185,100,65,90,c.mint)}<path d="M220 79 C185 44 205 19 221 37 C239 12 265 44 220 79Z" fill={c.pink} {...outline}/></>;
 case 8:return <>{tile(95,16,130,212,c.lav,28)}{tile(111,35,98,160,c.cream,14)}{tile(124,58,32,32,c.pink,9)}{tile(164,58,32,32,c.yellow,9)}{tile(144,106,32,32,c.mint,9)}<circle cx="160" cy="212" r="5" fill={c.ink}/></>;
 case 9:return <>{tile(68,120,184,93,c.mint)}{line('M116 120 L116 95 Q116 76 136 76 L184 76 Q204 76 204 95 L204 120')}{line('M160 30 L160 72',c.purple)}<path d="M147 58 L160 75 L173 58" fill="none" {...outline}/><circle cx="160" cy="30" r="18" fill={c.yellow} {...outline}/></>;
 case 10:return <>{tile(85,100,150,110,c.blue,28)}{tile(123,45,75,55,c.pink)}<circle cx="160" cy="151" r="34" fill={c.yellow} {...outline}/>{line('M160 132 L160 170 M141 151 L179 151')}</>;
 case 11:return <><path d="M60 115 Q160 10 260 115Z" fill={c.lav} {...outline}/>{line('M160 115 L160 196')}{line('M160 196 Q180 220 198 195')}<path d="M160 163 C105 118 122 87 160 119 C198 87 215 118 160 163Z" fill={c.pink} {...outline}/></>;
 case 12:return <><ellipse cx="160" cy="132" rx="99" ry="80" fill={c.cream} {...outline}/>{[[119,99,c.pink],[169,83,c.mint],[214,119,c.blue],[190,166,c.purple],[120,165,c.yellow]].map(([x,y,color],i)=><circle key={i} cx={x as number} cy={y as number} r="18" fill={color as string}/>)}<circle cx="158" cy="130" r="17" fill={c.cream} {...outline}/></>;
 case 13:return <>{tile(38,65,132,95,c.pink,38)}{tile(163,92,120,85,c.blue,38)}{line('M100 160 L75 192 L130 160')}{line('M220 177 L249 202 L246 174')}<circle cx="95" cy="110" r="9" fill={c.yellow}/><circle cx="126" cy="110" r="9" fill={c.yellow}/></>;
 case 14:return <><path d="M45 72 Q100 51 160 85 Q219 51 275 72 V205 Q218 181 160 216 Q102 181 45 205Z" fill={c.pink} {...outline}/>{line('M160 85 L160 216')}{line('M70 115 L130 128 M189 127 L250 114',c.cream)}<circle cx="160" cy="44" r="18" fill={c.yellow}/></>;
 case 15:return <>{tile(35,55,132,95,c.yellow,37)}{tile(174,111,104,70,c.mint,30)}{line('M167 116 L195 144 L220 113',c.purple)}{line('M73 185 L120 185',c.coral)}<circle cx="139" cy="185" r="12" fill={c.pink}/></>;
 default:return <circle cx="160" cy="120" r="65" fill={c.lav} {...outline}/>;
 }
}
function Artwork({children,active=true,variant=1}:{children:ReactNode;active?:boolean;variant?:number}){
 const reduced=useReducedMotion(); const animate=active && !reduced;
 const patterns=[
  {rotate:[-3,5,-3],y:[0,-10,0]}, {x:[-9,8,-9],scale:[.97,1.08,.97]},
  {rotate:[-8,8,-8],scale:[1,1.08,1]}, {x:[0,14,0],y:[0,-7,0]},
  {rotate:[0,11,0],y:[0,-9,0]}, {scale:[.94,1.1,.94],x:[-7,8,-7]},
  {y:[0,-13,0],scale:[1,1.07,1]}, {x:[-12,12,-12],rotate:[-4,5,-4]},
  {rotate:[-7,10,-7],y:[0,-6,0]}, {scale:[1,1.12,1],rotate:[-3,4,-3]},
  {x:[-8,6,-8],y:[1,-8,1]}, {rotate:[0,16,0],scale:[.97,1.06,.97]},
  {scale:[.96,1.1,.96],y:[0,-10,0]}, {rotate:[-12,4,-12],x:[-8,7,-8]},
  {x:[0,16,0],scale:[1,1.07,1]}
 ];
 const pattern=patterns[(variant-1)%patterns.length];
 return <svg viewBox="0 0 320 240" role="presentation" aria-hidden="true" focusable="false" className="untold-card-art" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="160" cy="211" rx="121" ry="15" fill={c.ink} opacity=".07"/>
  <motion.g initial={animate?{opacity:0,y:24,scale:.86}:false} animate={{opacity:1,y:0,scale:1}} transition={{duration:.7,ease:[.2,.8,.2,1]}}>
   <motion.g animate={animate?pattern:{rotate:0,y:0,scale:1,x:0}} transition={{duration:3.4,ease:'easeInOut',repeat:animate?Infinity:0,repeatDelay:.75}} style={{transformOrigin:'50% 50%'}}>{children}</motion.g>
  </motion.g>
 </svg>;
}
export function CardIllustration({cardId,animated=true}:Props){const n=Number(cardId.replace('CARD-',''));return <Artwork active={animated} variant={n}><Motif n={n}/></Artwork>}
export function CardBackIllustration({animated=true}:{animated?:boolean}){
 const reduced=useReducedMotion();const run=animated&&!reduced;
 return <svg viewBox="0 0 320 320" aria-hidden="true" focusable="false" className="untold-back-art">
  <circle cx="160" cy="160" r="128" fill={c.cream} opacity=".45"/>
  <motion.g animate={run?{rotate:[-11,11,-11]}:{rotate:0}} transition={{duration:3.1,repeat:run?Infinity:0,ease:'easeInOut'}} style={{transformOrigin:'160px 160px'}}>
   <rect x="82" y="82" width="156" height="156" rx="49" fill={c.pink} stroke={c.purple} strokeWidth="5" transform="rotate(13 160 160)"/>
   <rect x="109" y="109" width="102" height="102" rx="32" fill={c.lav} stroke={c.cream} strokeWidth="5" transform="rotate(-16 160 160)"/>
  </motion.g>
  <motion.g animate={run?{scale:[.9,1.14,.9]}:{scale:1}} transition={{duration:2.8,repeat:run?Infinity:0,ease:'easeInOut'}} style={{transformOrigin:'160px 160px'}}>
  <path d="M160 118V202 M118 160H202 M130 130L190 190 M190 130L130 190" stroke={c.ink} strokeWidth="11" strokeLinecap="round"/>
  </motion.g>
  <circle cx="65" cy="104" r="12" fill={c.mint}/><circle cx="264" cy="208" r="15" fill={c.yellow}/><circle cx="73" cy="238" r="9" fill={c.blue}/>
 </svg>;
}
