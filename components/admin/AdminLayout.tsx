"use client";

// components/admin/AdminLayout.tsx

import { ReactNode, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedWaveBackground from "@/components/general/Wavebackground";
import Mascot from "@/components/auth/Mascot";
import { useAuth } from "@/lib/auth-context";

interface AdminLayoutProps {
  children: ReactNode;
  titluPagina: string;
}

export default function AdminLayout({ children, titluPagina }: AdminLayoutProps) {
  const { profil, esteSuperadmin, logout } = useAuth();
  const [meniuDeschis, setMeniuDeschis] = useState(false);

  return (
    <div className="ogw-shell">
      <AnimatedWaveBackground />

      {/* Mascota interactivă - ascunsă pe mobil sau redusă ca dimensiune/poziție să nu blocheze interacțiunea */}
      <div 
        className="ogw-mascot-container"
        style={{ 
          position: "fixed", 
          bottom: "15px", 
          right: "15px", 
          zIndex: 40, 
          pointerEvents: "none",
          transform: "scale(0.8)",
          transformOrigin: "bottom right"
        }}
      >
        <Mascot />
      </div>

      {/* Bară de navigare superioară dedicată exclusiv pentru mobil/tableta */}
      <header 
        className="ogw-mobile-topbar" 
        style={{
          display: "none", // Va fi suprascris de media query sau adaptat flexibil
          position: "sticky",
          top: 0,
          zIndex: 60,
          width: "100%",
          padding: "0.75rem 1rem",
          background: "rgba(20, 20, 20, 0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Image 
            src="/images/logo.png" 
            alt="Orange Group 3" 
            width={36} 
            height={36} 
            priority 
          />
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>
            <span style={{ color: "var(--primary)" }}>Orange</span> Group
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMeniuDeschis(!meniuDeschis)}
          aria-label="Meniu"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "#fff",
            padding: "0.5rem 0.75rem",
            fontSize: "1.25rem",
            cursor: "pointer",
            minHeight: "40px",
            minWidth: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {meniuDeschis ? "✕" : "☰"}
        </button>
      </header>

      {/* Meniul lateral (Sidebar) - pe mobil devine Drawer flotant/ecran complet când este deschis */}
      <aside 
        className={`ogw-sidebar ${meniuDeschis ? "ogw-sidebar--deschis" : ""}`}
        style={{
          ...(meniuDeschis ? {
            transform: "translateX(0)",
            visibility: "visible",
            boxShadow: "0 0 50px rgba(0,0,0,0.8)"
          } : {})
        }}
      >
        {/* Buton de închidere rapidă pentru mobil în interiorul meniului */}
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", marginBottom: "-1rem" }} className="ogw-mobile-close-container">
          <button
            type="button"
            onClick={() => setMeniuDeschis(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0.5rem",
              display: "none" // Activat via CSS media query
            }}
            className="ogw-mobile-only-close"
            aria-label="Închide meniul"
          >
            ✕
          </button>
        </div>

        {/* Logo mărit și poziționat pe centru */}
        <div className="ogw-sidebar__logo-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem", textAlign: "center" }}>
          <Image 
            src="/images/logo.png" 
            alt="Orange Group 3" 
            width={60} 
            height={60} 
            priority 
            style={{ marginBottom: "0.5rem" }}
          />
          <span style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
            <span style={{ color: "var(--primary)" }}>Orange</span>{" "}
            <span style={{ color: "var(--ogw-text-main, #1a1a1a)" }}>Group 3</span>
          </span>
        </div>

        <nav className="ogw-sidebar__nav" onClick={() => setMeniuDeschis(false)}>
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

        {/* Profilul adminului jos */}
        <div className="ogw-sidebar__profil">
          <div className="ogw-sidebar__avatar" style={{ overflow: "hidden", position: "relative" }}>
            {profil?.poza_url ? (
              <img src={profil.poza_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span>{profil?.nume_afisat?.[0]?.toUpperCase() ?? "?"}</span>
            )}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
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
            style={{ minHeight: "40px", minWidth: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* Fundal semi-transparent pe mobil când meniul e deschis */}
      {meniuDeschis && (
        <div 
          onClick={() => setMeniuDeschis(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 90
          }}
          className="ogw-sidebar-overlay"
        />
      )}

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

      {/* Stiluri responsive injectate direct pentru a garanta comportamentul corect pe mobil */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .ogw-mobile-topbar {
            display: flex !important;
          }
          .ogw-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            width: 280px !important;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: var(--ogw-sidebar-bg, #1a1a1a) !important;
          }
          .ogw-sidebar.ogw-sidebar--deschis {
            transform: translateX(0) !important;
          }
          .ogw-mobile-only-close {
            display: block !important;
          }
          .ogw-shell {
            display: flex;
            flex-direction: column;
          }
          .ogw-main {
            width: 100% !important;
            padding: 1rem !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}