"use client";

// app/admin/dashboard/page.tsx
// Pagina principala a panelului de administrare.
// Presupune ca AuthProvider e deja pus in app/layout.tsx (radacina aplicatiei).

import AdminLayout from "@/components/admin/AdminLayout";
import CVDashboard from "@/components/admin/CVDashboard";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { profil, seIncarca } = useAuth();

  if (seIncarca) return <p className="ogw-loading">Se incarca...</p>;
  if (!profil) return <p className="ogw-loading">Trebuie sa fii autentificat.</p>;

  return (
    <AdminLayout titluPagina={`Bine ai revenit, ${profil.nume_afisat.split(" ")[0]}`}>
      <CVDashboard />
    </AdminLayout>
  );
}