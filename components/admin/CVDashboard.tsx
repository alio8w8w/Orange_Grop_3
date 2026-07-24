"use client";

// components/admin/CVDashboard.tsx
// Panoul principal: superadmin vede cardurile tuturor adminilor, adminul obisnuit editeaza direct CV-ul lui.

import { useEffect, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import CVEditor from "@/components/admin/CVEditor";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { CV, AdminProfile } from "@/types/cv";

interface RandCV {
  cv: CV | null;
  admin: AdminProfile;
}

export default function CVDashboard() {
  const { profil, esteSuperadmin } = useAuth();
  const [randuri, setRanduri] = useState<RandCV[]>([]);
  const [adminSelectat, setAdminSelectat] = useState<string | null>(null);
  const [seIncarca, setSeIncarca] = useState(true);
  const [eroare, setEroare] = useState<string | null>(null);

  useEffect(() => {
    async function incarcaDate() {
      if (!profil) return;

      setSeIncarca(true);
      setEroare(null);

      try {
        if (esteSuperadmin) {
          const [rezAdmini, rezCvuri] = await Promise.all([
            supabase.from("profiles").select("*").order("created_at"),
            supabase.from("cvs").select("*"),
          ]);

          if (rezAdmini.error) throw rezAdmini.error;
          if (rezCvuri.error) throw rezCvuri.error;

          const admini = (rezAdmini.data ?? []) as AdminProfile[];
          const cvuri = (rezCvuri.data ?? []) as CV[];

          const combinate: RandCV[] = admini.map((admin) => ({
            admin,
            cv: cvuri.find((c) => c.admin_id === admin.id) ?? null,
          }));

          setRanduri(combinate);
        } else {
          const { data: cvProprie, error } = await supabase
            .from("cvs")
            .select("*")
            .eq("admin_id", profil.id)
            .maybeSingle();

          if (error) throw error;

          setRanduri([{ admin: profil, cv: (cvProprie as CV) ?? null }]);
          setAdminSelectat(profil.id);
        }
      } catch (err) {
        setEroare(err instanceof Error ? err.message : "A apărut o eroare la încărcarea datelor.");
      } finally {
        setSeIncarca(false);
      }
    }

    incarcaDate();
  }, [profil, esteSuperadmin]);

  if (seIncarca) {
    return <p className="ogw-loading">Se încarcă panoul...</p>;
  }

  if (eroare) {
    return (
      <GlassPanel className="ogw-editor__sectiune">
        <p className="ogw-mesaj ogw-mesaj--eroare">{eroare}</p>
      </GlassPanel>
    );
  }

  if (adminSelectat) {
    const rand = randuri.find((r) => r.admin.id === adminSelectat);
    if (rand) {
      return (
        <div>
          {esteSuperadmin && (
            <button 
              type="button" 
              className="ogw-btn ogw-btn--ghost ogw-back-btn" 
              onClick={() => setAdminSelectat(null)}
            >
              ← Înapoi la toate CV-urile
            </button>
          )}
          <CVEditor
            adminId={rand.admin.id}
            cvInitial={rand.cv}
            onSalvat={(cvNou) =>
              setRanduri((prev) =>
                prev.map((r) => (r.admin.id === rand.admin.id ? { ...r, cv: cvNou } : r))
              )
            }
          />
        </div>
      );
    }
  }

  return (
    <div className="ogw-grid ogw-grid--carduri">
      {randuri.map(({ admin, cv }, i) => (
        <GlassPanel key={admin.id} className="ogw-card-cv" intarziereReveal={i * 0.05}>
          <div className="ogw-card-cv__avatar">
            {admin.nume_afisat[0]?.toUpperCase() ?? "A"}
          </div>
          <h3>{admin.nume_afisat}</h3>
          <p className="ogw-card-cv__status">
            {cv ? `Status: ${cv.status.replace("_", " ")}` : "Fără CV creat încă"}
          </p>
          <button 
            type="button" 
            className="ogw-btn ogw-btn--primar" 
            onClick={() => setAdminSelectat(admin.id)}
          >
            {cv ? "Deschide & editează" : "Creează CV"}
          </button>
        </GlassPanel>
      ))}
    </div>
  );
}