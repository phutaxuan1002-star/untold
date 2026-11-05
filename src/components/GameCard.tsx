"use client";
import { motion, useReducedMotion } from 'motion/react';
import type { Card } from '@/data/questions';
import { CardIllustration, CardBackIllustration } from './illustrations/CardIllustration';
export function GameCard({card}:{card:Card|null}){
  const reduce=useReducedMotion();
  return <div className="flip-perspective w-full mx-auto aspect-[2/3]" aria-live="polite">
    <motion.div className="flip-inner" animate={{rotateY:card?180:0}} transition={{duration:reduce?0:.65,ease:[.2,.8,.2,1]}}>
      <div className="face card-back flex flex-col justify-center items-center" aria-hidden={Boolean(card)}>
        <div className="card-back-illustration"><CardBackIllustration animated={!Boolean(card)}/></div><p className="card-back-wordmark">UNTOLD</p>
      </div>
      <div className="face front question-card flex flex-col justify-center" aria-hidden={!card}>
        <div className="question-content">
          {card && <CardIllustration key={card.id} cardId={card.id} animated={Boolean(card)} />}
          <h2 lang="vi" className="question-vi">{card?.questionVi}</h2>
          <div className="question-divider"/>
          <p lang="en" className="question-en">{card?.questionEn}</p>
        </div>

      </div>
    </motion.div>
  </div>;
}
