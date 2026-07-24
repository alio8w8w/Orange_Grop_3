'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import AnimatedWaveBackground from '@/components/ui/Animatedwavebackground'
import Mascot from '@/components/auth/Mascot'
import { useAuth } from '@/lib/auth-context'

interface AdminLayoutProps {
  children: ReactNode
  titluPagina: string
}

export default function AdminLayout({ children, titluPagina }: AdminLayoutProps) {
  const { profil, esteSuperadmin, logout } = useAuth()

  return (
    <div className="ogw-shell">
      <AnimatedWaveBackground />
      
      {/* Mascota acum acceptă marime={72} și se va scala proporțional fără erori TypeScript */}
     

      <aside className="ogw-sidebar ogw-glass">
        <div className="ogw-sidebar__logo">
          <Image src="/images/logo.png" alt="Orange Group 3" width={44} height={44} />
          <span>Orange_Group_3</span>
        </div>

        <nav className="ogw-sidebar__nav">
          <a href="/admin/dashboard" className="ogw-sidebar__link ogw-sidebar__link--activ">
            Panou principal
          </a>
          <a href="/admin/dashboard/cv-uri" className="ogw-sidebar__link">
            {esteSuperadmin ? 'Toate CV-urile' : 'CV-ul meu'}
          </a>
          {esteSuperadmin && (
            <a href="/admin/dashboard/administratori" className="ogw-sidebar__link">
              Administratori
            </a>
          )}
        </nav>

        <div className="ogw-sidebar__profil">
          <div className="ogw-sidebar__avatar">
            {profil?.nume_afisat?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="ogw-sidebar__nume">{profil?.nume_afisat ?? '...'}</p>
            <p className="ogw-sidebar__rol">
              {esteSuperadmin ? 'Admin superior' : 'Administrator'}
            </p>
          </div>
          <button onClick={logout} className="ogw-sidebar__logout" aria-label="Deconectare">
            ⏻
          </button>
        </div>
      </aside>

      <main className="ogw-main">
        <motion.header
          className="ogw-main__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>{titluPagina}</h1>
        </motion.header>

        <div className="ogw-main__content">{children}</div>
      </main>
    </div>
  )
}