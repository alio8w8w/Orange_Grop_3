"use client";

// components/admin/CVDashboard.tsx

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
        const profilAdminId = (profil as any).admin_id;

        if (esteSuperadmin) {
          const [rezAdmini, rezCvuri] = await Promise.all([
            supabase.from("admin_profiles").select("*").order("created_at"),
            supabase.from("cvs").select("*"),
          ]);

          if (rezAdmini.error) throw rezAdmini.error;
          if (rezCvuri.error) throw rezCvuri.error;

          const admini = (rezAdmini.data ?? []) as AdminProfile[];
          const cvuri = (rezCvuri.data ?? []) as CV[];

          const combinate: RandCV[] = admini.map((admin) => {
            const currentAdminId = (admin as any).admin_id;
            return {
              admin,
              cv: cvuri.find((c) => c.admin_id === currentAdminId) ?? null,
            };
          });

          setRanduri(combinate);
        } else {
          const { data: cvProprie, error } = await supabase
            .from("cvs")
            .select("*")
            .eq("admin_id", profilAdminId)
            .maybeSingle();

          if (error) throw error;

          setRanduri([{ admin: profil, cv: (cvProprie as CV) ?? null }]);
          setAdminSelectat(profilAdminId);
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
    return <p className="ogw-loading" style={{ color: "white", padding: "2rem" }}>Se încarcă panoul...</p>;
  }

  if (eroare) {
    return (
      <GlassPanel className="ogw-editor__sectiune">
        <p className="ogw-mesaj ogw-mesaj--eroare">{eroare}</p>
      </GlassPanel>
    );
  }

  if (adminSelectat) {
    const rand = randuri.find((r) => (r.admin as any).admin_id === adminSelectat);
    if (rand) {
      const realAdminId = (rand.admin as any).admin_id;
      return (
        <div className="ogw-editor-wrapper">
          {esteSuperadmin && (
            <button 
              type="button" 
              className="ogw-btn ogw-btn--ghost ogw-back-btn" 
              style={{ marginBottom: "1.5rem" }}
              onClick={() => setAdminSelectat(null)}
            >
              ← Înapoi la toate CV-urile
            </button>
          )}
          <CVEditor
            adminId={realAdminId}
            cvInitial={rand.cv}
            onSalvat={(cvNou) =>
              setRanduri((prev) =>
                prev.map((r) => ((r.admin as any).admin_id === realAdminId ? { ...r, cv: cvNou } : r))
              )
            }
          />
        </div>
      );
    }
  }

  return (
    <div className="ogw-grid ogw-grid--carduri">
      {randuri.map(({ admin, cv }, i) => {
        const currentAdminId = (admin as any).admin_id;
        return (
          <GlassPanel key={currentAdminId} className="ogw-card-cv" intarziereReveal={i * 0.05}>
            <div className="ogw-card-cv__avatar">
              {admin.nume_afisat?.[0]?.toUpperCase() ?? "A"}
            </div>
            <h3 style={{ margin: "0.5rem 0", fontWeight: 600 }}>{admin.nume_afisat ?? "Administrator"}</h3>
            <p className="ogw-card-cv__status" style={{ opacity: 0.8, fontSize: "0.875rem", marginBottom: "1rem" }}>
              {cv ? `Status: ${cv.status?.replace("_", " ")}` : "Fără CV creat încă"}
            </p>
            <button 
              type="button" 
              className="ogw-btn ogw-btn--primar" 
              onClick={() => setAdminSelectat(currentAdminId)}
            >
              {cv ? "Deschide & editează" : "Creează CV"}
            </button>
          </GlassPanel>
        );
      })}
    </div>
  );
}