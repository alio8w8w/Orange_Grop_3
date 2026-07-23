// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'

import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Aplicația Mea',
    template: '%s | Aplicația Mea',
  },
  description: 'Descrierea aplicației tale',
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Dacă limba din URL nu este validă, folosim limba implicită în loc de notFound()
  const activeLocale = routing.locales.includes(locale as any)
    ? locale
    : routing.defaultLocale

  // Preluăm mesajele pentru limba activă
  const messages = await getMessages({ locale: activeLocale })

  return (
    <html lang={activeLocale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={activeLocale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}