import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-archivo',
})

export const metadata: Metadata = {
  title: 'Orange Group 3 — Creative Team Portfolio',
  description:
    'A dynamic creative team portfolio. Meet the six members of Orange Group 3, explore their skills and browse their project work.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#f28c3c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body className="antialiased bg-background font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
