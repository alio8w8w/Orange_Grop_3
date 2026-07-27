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

      {/* Mascota interactivă pentru mouse */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 50, pointerEvents: "none" }}>
        <Mascot />
      </div>

      {/* Sidebar stilizat */}
      <aside className="ogw-sidebar">
        {/* Logo mărit și poziționat pe centru, cu textul Orange Group în 2 culori */}
        <div className="ogw-sidebar__logo-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem", textAlign: "center" }}>
          <Image 
            src="/images/logo.png" 
            alt="Orange Group 3" 
            width={72} 
            height={72} 
            priority 
            style={{ marginBottom: "0.5rem" }}
          />
          <span style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
            <span style={{ color: "var(--primary)" }}>Orange</span>{" "}
            <span style={{ color: "#1a1a1a" }}>Group 3</span>
          </span>
        </div>

        <nav className="ogw-sidebar__nav">
          <a href="/admin/dashboard" className="ogw-sidebar__link ogw-sidebar__link--activ">
            Panou principal
          </a>
          <a href="/admin/dashboard/cv-uri" className="ogw-sidebar__link">
            {esteSuperadmin ? "Toate CV-urile" : "CV-ul meu"}
          </a>
          {esteSuperadmin && (
            <a href="/admin/dashboard/administratori" className="ogw-sidebar__link">
              Administratori
            </a>
          )}
        </nav>

        {/* Profilul adminului jos: Nume și Poza reală din DB */}
        <div className="ogw-sidebar__profil">
          <div className="ogw-sidebar__avatar" style={{ overflow: "hidden", position: "relative" }}>
            {profil?.poza_url ? (
              <img src={profil.poza_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span>{profil?.nume_afisat?.[0]?.toUpperCase() ?? "?"}</span>
            )}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p className="ogw-sidebar__nume" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: 600 }}>
              {profil?.nume_afisat ?? "Administrator"}
            </p>
            <p className="ogw-sidebar__rol" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {esteSuperadmin ? "Admin superior" : "Administrator"}
            </p>
          </div>
          <button 
            type="button" 
            onClick={logout} 
            className="ogw-sidebar__logout" 
            aria-label="Deconectare"
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* Zona principală */}
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
  );
}