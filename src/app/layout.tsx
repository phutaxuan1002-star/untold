import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
const instrument = Instrument_Sans({subsets:['latin','vietnamese'],display:'swap',variable:'--instrument-sans'});
export const metadata: Metadata = { title: 'Untold — Stories untold. Connections unfold.', description: 'Discover the people behind the team. Multiplayer bilingual icebreaker cards.' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="vi"><body className={instrument.variable}>{children}</body></html>}
