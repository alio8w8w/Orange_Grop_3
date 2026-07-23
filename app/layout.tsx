import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Optimizare și încărcare font (standard în Next.js)
const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

// Definitie Metadata globală (SEO și titlu în tab-ul din browser)
export const metadata: Metadata = {
  title: {
    default: 'Aplicația Mea',
    template: '%s | Aplicația Mea',
  },
  description: 'Descrierea aplicației tale',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}