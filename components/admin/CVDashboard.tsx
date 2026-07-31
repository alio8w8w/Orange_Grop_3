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
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem", color: "white" }}>
        <p className="ogw-loading">Se încarcă panoul...</p>
      </div>
    );
  }

  if (eroare) {
    return (
      <div style={{ padding: "0 1rem" }}>
        <GlassPanel className="ogw-editor__sectiune">
          <p className="ogw-mesaj ogw-mesaj--eroare">{eroare}</p>
        </GlassPanel>
      </div>
    );
  }

  if (adminSelectat) {
    const rand = randuri.find((r) => (r.admin as any).admin_id === adminSelectat);
    if (rand) {
      const realAdminId = (rand.admin as any).admin_id;
      return (
        <div className="ogw-editor-wrapper" style={{ width: "100%", padding: "0.5rem" }}>
          <button 
            type="button" 
            className="ogw-btn ogw-btn--ghost ogw-back-btn" 
            style={{ 
              marginBottom: "1.5rem", 
              width: "100%", 
              justifyContent: "center",
              minHeight: "44px" // Optimizat pentru touch pe mobil
            }} 
            onClick={() => setAdminSelectat(null)}
          >
            ← Înapoi la panoul de control
          </button>
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
    <div 
      className="ogw-grid ogw-grid--carduri"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1rem",
        width: "100%",
        padding: "0.5rem"
      }}
    >
      {randuri.map(({ admin, cv }, i) => {
        const currentAdminId = (admin as any).admin_id;
        return (
          <GlassPanel 
            key={currentAdminId} 
            className="ogw-card-cv" 
            intarziereReveal={i * 0.05}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "1.5rem 1rem",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <div 
              className="ogw-card-cv__avatar"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.1)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.75rem"
              }}
            >
              {admin.nume_afisat?.[0]?.toUpperCase() ?? "A"}
            </div>
            <h3 style={{ margin: "0.5rem 0", fontWeight: 600, fontSize: "1.1rem", wordBreak: "break-word" }}>
              {admin.nume_afisat ?? "Administrator"}
            </h3>
            <p className="ogw-card-cv__status" style={{ opacity: 0.8, fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              {cv ? `Status: ${cv.status?.replace("_", " ")}` : "Fără CV creat încă"}
            </p>
            <button 
              type="button" 
              className="ogw-btn ogw-btn--primar" 
              style={{
                width: "100%",
                minHeight: "44px", // Zonă de tap generoasă pe dispozitive mobile
                justifyContent: "center"
              }}
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