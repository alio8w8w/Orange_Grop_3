// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

import '../globals.css'

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

  // Validare limbă din URL
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const activeLocale = locale
  const messages = await getMessages({ locale: activeLocale })

  return (
    // Înlocuim <html> și <body> cu un container care preia fontul și atributele
    <div className={`${inter.className} antialiased`} lang={activeLocale}>
      <NextIntlClientProvider messages={messages} locale={activeLocale}>
        {children}
      </NextIntlClientProvider>
    </div>
  )
}