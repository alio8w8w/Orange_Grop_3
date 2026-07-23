import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // Lista limbilor suportate în aplicație
  locales: ['ro', 'en'],

  // Limba implicită folosită când nu există un prefix în URL
  defaultLocale: 'ro',

  // Opțional: poți seta 'as-needed' dacă nu vrei prefixul /ro în URL pentru limba implicită
  // localePrefix: 'as-needed'
})

// Utilitare de navigare configurate automat cu prefixul de i18n
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)