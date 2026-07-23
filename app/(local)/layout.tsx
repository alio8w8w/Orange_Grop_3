import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Preluăm limba curentă și fișierele de traduceri pe server
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${archivo.variable} bg-brand-black`}
    >
      <body className="antialiased bg-brand-black font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}