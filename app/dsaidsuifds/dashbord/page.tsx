"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import CVDashboard from "@/components/admin/CVDashboard";
import { useAuth } from "@/lib/auth-context";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { profil, seIncarca } = useAuth();

  // 1. Dacă încă se încarcă datele, afișăm un loading simplu
  if (seIncarca) {
    return <p className="ogw-loading" style={{ color: '#ffe9d6', textAlign: 'center', marginTop: '20vh' }}>Se incarca...</p>;
  }

  // 2. Doar dacă s-a terminat de încărcat ȘI profilul lipsește definitiv, afișăm mesajul
  if (!profil) {
    return <p className="ogw-loading" style={{ color: '#ffe9d6', textAlign: 'center', marginTop: '20vh' }}>Trebuie sa fii autentificat.</p>;
  }

  // 3. Dacă totul este valid, randăm în sfârșit panoul de admin!
  return (
    <AdminLayout titluPagina={`Bine ai revenit, ${profil?.nume_afisat?.split(" ")[0] || 'Admin'}`}>
      <CVDashboard />
    </AdminLayout>
  );
}