"use client";
import { motion, useReducedMotion } from 'motion/react';
import type { Card } from '@/data/questions';
export function GameCard({card}:{card:Card|null}){
  const reduce=useReducedMotion();
  return <div className="flip-perspective w-full mx-auto aspect-[2/3]" aria-live="polite">
    <motion.div className="flip-inner" animate={{rotateY:card?180:0}} transition={{duration:reduce?0:.65,ease:[.2,.8,.2,1]}}>
      <div className="face card-back flex flex-col justify-center items-center" aria-hidden={Boolean(card)}>
        <div className="card-back-emblem"><span>✳</span></div><p className="card-back-wordmark">UNTOLD</p>
      </div>
      <div className="face front question-card flex flex-col justify-center" aria-hidden={!card}>
        <div className="question-content">
          <div className="question-mark" aria-hidden="true">✳</div>
          <h2 lang="vi" className="question-vi">{card?.questionVi}</h2>
          <div className="question-divider"/>
          <p lang="en" className="question-en">{card?.questionEn}</p>
        </div>
        <span className="question-corner" aria-hidden="true">✳</span>
      </div>
    </motion.div>
  </div>;
}
