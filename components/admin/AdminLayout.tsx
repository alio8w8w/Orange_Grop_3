"use client";

// components/admin/AdminLayout.tsx

import { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedWaveBackground from "@/components/general/Wavebackground";
import Mascot from "@/components/auth/Mascot";
import { useAuth } from "@/lib/auth-context";

interface AdminLayoutProps {
  children: ReactNode;
  titluPagina: string;
}

export default function AdminLayout({ children, titluPagina }: AdminLayoutProps) {
  const { profil, esteSuperadmin, logout } = useAuth();

  return (
    <div className="ogw-shell">
      <AnimatedWaveBackground />

      {/* Mascota interactivă pentru mouse - ascunsă pe ecrane foarte mici pentru a nu încurca */}
      <div className="hidden md:block" style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 50, pointerEvents: "none" }}>
        <Mascot />
      </div>

      {/* Sidebar stilizat */}
      <aside className="ogw-sidebar">
        {/* Logo și text - Imaginea se ascunde pe mobil (hidden md:block), textul este mărit */}
        <div className="ogw-sidebar__logo-container flex flex-col items-center mb-6 md:mb-8 text-center">
          <div className="hidden md:block mb-3">
            <Image 
              src="/images/logo.png" 
              alt="Orange Group 3" 
              width={80} 
              height={80} 
              priority 
              className="drop-shadow-md"
            />
          </div>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span style={{ color: "var(--primary)" }}>Orange</span>{" "}
            <span className="text-gray-900">Group 3</span>
          </span>
        </div>

        <nav className="ogw-sidebar__nav flex flex-col gap-2 mb-auto">
          <a href="/admin/dashboard" className="ogw-sidebar__link p-3 rounded-lg text-lg font-medium hover:bg-orange-100 transition-colors">
            Panou principal
          </a>
          <a href="/admin/dashboard/cv-uri" className="ogw-sidebar__link p-3 rounded-lg text-lg font-medium hover:bg-orange-100 transition-colors">
            {esteSuperadmin ? "Toate CV-urile" : "CV-ul meu"}
          </a>
          {esteSuperadmin && (
            <a href="/admin/dashboard/administratori" className="ogw-sidebar__link p-3 rounded-lg text-lg font-medium hover:bg-orange-100 transition-colors">
              Administratori
            </a>
          )}
        </nav>

        {/* Profilul adminului jos */}
        <div className="ogw-sidebar__profil flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
          <div className="ogw-sidebar__avatar w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center shadow-sm">
            {profil?.poza_url ? (
              <img src={profil.poza_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-gray-500">{profil?.nume_afisat?.[0]?.toUpperCase() ?? "?"}</span>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="ogw-sidebar__nume truncate font-bold text-lg text-gray-900">
              {profil?.nume_afisat ?? "Administrator"}
            </p>
            <p className="ogw-sidebar__rol text-sm text-gray-500 font-medium">
              {esteSuperadmin ? "Admin superior" : "Administrator"}
            </p>
          </div>
          <button 
            type="button" 
            onClick={logout} 
            className="ogw-sidebar__logout p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
            aria-label="Deconectare"
            title="Deconectare"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </aside>

      {/* Zona principală */}
      <main className="ogw-main">
        <motion.header
          className="ogw-main__header mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{titluPagina}</h1>
        </motion.header>

        <div className="ogw-main__content">{children}</div>
      </main>
    </div>
  );
}