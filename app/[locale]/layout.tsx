// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

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
    <NextIntlClientProvider messages={messages} locale={activeLocale}>
      {children}
    </NextIntlClientProvider>
  )
}