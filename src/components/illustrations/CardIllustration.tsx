'use client';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = { cardId: string; animated?: boolean };
const c = { ink:'#383139',pink:'#f6a3ca',mint:'#c0efdc',lav:'#ded0f9',yellow:'#f9e7a8',blue:'#c5e5fb',cream:'#fffdf7',purple:'#9a83cb',coral:'#e58799',green:'#70b79b' };
const stroke={ stroke:c.ink,strokeWidth:4,strokeLinecap:'round' as const,strokeLinejoin:'round' as const };
function Figure({x=45,y=80,shirt=c.pink,arm='up'}:{x?:number;y?:number;shirt?:string;arm?:'up'|'out'|'rest'}){return <g transform={`translate(${x} ${y})`}>
  <ellipse cx="48" cy="140" rx="42" ry="9" fill={c.ink} opacity=".1"/>
  <path d="M20 107 Q14 65 46 62 Q82 62 77 107 L77 137 L18 137Z" fill={shirt} {...stroke}/>
  <path d={arm==='up'?'M72 80 Q103 60 110 23':arm==='out'?'M73 86 Q110 82 127 66':'M73 83 Q83 107 74 119'} fill="none" {...stroke} strokeWidth="14"/>
  <path d="M29 82 L13 111" fill="none" {...stroke} strokeWidth="13"/>
  <path d="M31 137 L28 157 M63 137 L67 157" {...stroke} strokeWidth="12"/>
  <circle cx="48" cy="37" r="29" fill="#ffc4aa" {...stroke}/>
  <path d="M21 34 Q17 -4 50 8 Q73 0 76 29 Q64 14 46 22 Q31 16 21 34Z" fill="#55414c"/>
  <circle cx="40" cy="39" r="2.5" fill={c.ink}/><circle cx="57" cy="39" r="2.5" fill={c.ink}/>
  <path d="M42 49 Q49 57 57 49" fill="none" {...stroke} strokeWidth="2.5"/>
</g>}
function Burst({x=220,y=48,color=c.yellow}:{x?:number;y?:number;color?:string}) {return <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth="7" strokeLinecap="round"><path d="M0 -20V-10 M0 10V20 M-20 0H-10 M10 0H20 M-14 -14L-7 -7 M7 7L14 14 M-14 14L-7 7 M7 -7L14 -14"/></g>}
function Heart({x=200,y=75}:{x?:number;y?:number}){return <path transform={`translate(${x} ${y}) scale(.7)`} d="M0 19 C-41 -13 -12 -45 0 -20 C12 -45 41 -13 0 19Z" fill={c.coral} {...stroke}/>}
function Bubble({x=170,y=25,w=92,h=62,fill=c.cream}:{x?:number;y?:number;w?:number;h?:number;fill?:string}){return <g transform={`translate(${x} ${y})`}><rect width={w} height={h} rx="25" fill={fill} {...stroke}/><path d={`M18 ${h-2} L11 ${h+16} L42 ${h-2}`} fill={fill} {...stroke}/><circle cx={w*.3} cy={h*.47} r="4" fill={c.ink}/><circle cx={w*.5} cy={h*.47} r="4" fill={c.ink}/><circle cx={w*.7} cy={h*.47} r="4" fill={c.ink}/></g>}
function Motif({n}:{n:number}) {switch(n){
case 1:return <><Figure x={18} y={68} shirt={c.pink} arm="out"/><Figure x={177} y={80} shirt={c.mint} arm="up"/><path d="M133 156 Q158 129 181 149" fill="none" stroke={c.purple} strokeWidth="9" strokeLinecap="round"/><path d="M171 134 L184 149 L166 155" fill="none" {...stroke}/></>;
case 2:return <><Figure x={2} y={90} shirt={c.blue} arm="out"/><Figure x={112} y={90} shirt={c.yellow} arm="up"/><Figure x={216} y={92} shirt={c.pink}/><rect x="120" y="64" width="48" height="42" rx="12" fill={c.mint} {...stroke}/><rect x="172" y="20" width="47" height="42" rx="12" fill={c.lav} {...stroke}/></>;
case 3:return <><Figure x={15} y={85} shirt={c.yellow}/><rect x="161" y="32" width="115" height="158" rx="52" fill={c.blue} {...stroke}/><rect x="173" y="44" width="91" height="133" rx="43" fill={c.cream}/><circle cx="218" cy="85" r="25" fill={c.pink}/><path d="M195 122 Q217 106 240 123" fill="none" stroke={c.purple} strokeWidth="18" strokeLinecap="round"/><Burst x={275} y={35}/></>;
case 4:return <><Figure x={12} y={95} shirt={c.blue}/><path d="M132 171 Q159 101 181 157 Q194 195 218 133 Q239 79 281 67" fill="none" stroke={c.coral} strokeWidth="10" strokeLinecap="round" strokeDasharray="17 13"/><circle cx="279" cy="63" r="18" fill={c.mint} {...stroke}/><path d="M268 62L276 71L292 54" fill="none" {...stroke}/></>;
case 5:return <><Figure x={13} y={95} shirt={c.mint} arm="up"/><circle cx="220" cy="114" r="74" fill={c.blue} {...stroke}/><path d="M169 82 L193 75 L206 100 L195 119 L170 118Z M238 120L265 107L269 145L236 161L223 143Z" fill={c.green}/><path d="M206 45 Q223 21 240 50" fill="none" stroke={c.purple} strokeWidth="7"/><path d="M229 42 Q225 25 242 20 M229 42Q246 32 254 42" stroke={c.green} strokeWidth="7" fill="none" strokeLinecap="round"/></>;
case 6:return <><Figure x={5} y={104} shirt={c.lav} arm="out"/><Figure x={196} y={104} shirt={c.mint}/><Bubble x={115} y={17} w={100} h={68} fill={c.yellow}/><path d="M147 51 L160 42 L171 54 L184 40" {...stroke} fill="none"/></>;
case 7:return <><Figure x={10} y={90} shirt={c.pink}/><rect x="153" y="143" width="45" height="46" rx="13" fill={c.yellow} {...stroke}/><rect x="206" y="112" width="45" height="76" rx="13" fill={c.mint} {...stroke}/><rect x="258" y="145" width="40" height="44" rx="13" fill={c.blue} {...stroke}/><Heart x={227} y={84}/><Burst x={280} y={65}/></>;
case 8:return <><rect x="96" y="16" width="126" height="208" rx="27" fill={c.lav} {...stroke}/><rect x="109" y="34" width="100" height="165" rx="13" fill={c.cream}/><rect x="124" y="60" width="32" height="32" rx="10" fill={c.pink}/><rect x="164" y="60" width="32" height="32" rx="10" fill={c.yellow}/><rect x="124" y="103" width="32" height="32" rx="10" fill={c.mint}/><circle cx="160" cy="213" r="5" fill={c.ink}/><path d="M42 72 L70 60 M251 70L280 80 M43 165L73 158" {...stroke} strokeWidth="7"/></>;
case 9:return <><Figure x={11} y={72} shirt={c.blue} arm="out"/><rect x="140" y="151" width="150" height="14" rx="6" fill={c.purple}/><rect x="171" y="72" width="80" height="80" rx="12" fill={c.yellow} {...stroke}/><path d="M190 109 Q213 76 233 107 Q215 133 190 109Z" fill={c.pink}/><path d="M213 151 V194" stroke={c.ink} strokeWidth="6"/><Burst x={258} y={52}/></>;
case 10:return <><Figure x={9} y={92} shirt={c.mint} arm="out"/><rect x="166" y="98" width="99" height="99" rx="25" fill={c.blue} {...stroke}/><circle cx="215" cy="146" r="31" fill={c.yellow} {...stroke}/><path d="M215 128V163 M201 145H229" {...stroke} strokeWidth="6"/><rect x="187" y="72" width="56" height="26" rx="10" fill={c.pink} {...stroke}/><Burst x={270} y={67}/></>;
case 11:return <><Figure x={7} y={90} shirt={c.lav} arm="out"/><Figure x={190} y={91} shirt={c.mint} arm="out"/><Heart x={155} y={90}/><path d="M128 169 Q160 188 196 162" fill="none" stroke={c.coral} strokeWidth="9" strokeLinecap="round"/></>;
case 12:return <><Figure x={9} y={90} shirt={c.yellow} arm="up"/><ellipse cx="226" cy="126" rx="68" ry="58" fill={c.cream} {...stroke}/><circle cx="207" cy="97" r="12" fill={c.pink}/><circle cx="237" cy="90" r="12" fill={c.mint}/><circle cx="264" cy="115" r="12" fill={c.blue}/><circle cx="241" cy="145" r="12" fill={c.purple}/><circle cx="202" cy="148" r="12" fill={c.yellow}/><circle cx="222" cy="121" r="13" fill={c.cream} {...stroke}/></>;
case 13:return <><Figure x={7} y={94} shirt={c.pink}/><Figure x={203} y={95} shirt={c.blue}/><Bubble x={96} y={4} w={93} h={57} fill={c.yellow}/><Bubble x={199} y={21} w={77} h={50} fill={c.mint}/></>;
case 14:return <><Figure x={20} y={83} shirt={c.mint} arm="out"/><path d="M149 92 Q188 76 217 101 Q246 76 284 92 V202 Q246 188 217 210 Q179 189 149 202Z" fill={c.pink} {...stroke}/><path d="M217 101V210" fill="none" {...stroke}/><path d="M165 125L198 132 M235 132L266 126 M165 152L198 161 M236 161L267 154" stroke={c.cream} strokeWidth="6" strokeLinecap="round"/><Burst x={252} y={54}/></>;
case 15:return <><Figure x={14} y={87} shirt={c.blue} arm="up"/><Bubble x={161} y={27} w={115} h={78} fill={c.yellow}/><path d="M190 145 Q219 115 249 145" fill="none" stroke={c.coral} strokeWidth="15" strokeLinecap="round"/><Heart x={219} y={182}/></>;
default:return <><Burst x={160} y={110}/></>;
}}
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
