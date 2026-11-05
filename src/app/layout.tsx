import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Untold — Discover Your Potential', description: 'Discover the people behind the team. Multiplayer bilingual icebreaker cards.' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="vi"><body>{children}</body></html>}
