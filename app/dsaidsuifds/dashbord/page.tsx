"use client";

// Pagina principală a panelului de administrare.
import AdminLayout from "@/components/admin/AdminLayout";
import CVDashboard from "@/components/admin/CVDashboard";
import { useAuth } from "@/lib/auth-context";

// OBLIGATORIU pentru paginile protejate/cu date de sesiune: 
// Oprește generarea statică la build și forțează randarea dinamică la runtime.
export const dynamic = 'force-dynamic';

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