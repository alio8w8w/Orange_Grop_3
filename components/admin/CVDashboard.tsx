"use client";

// components/admin/CVDashboard.tsx
// Panoul principal: superadmin vede cardurile tuturor celor 4 CV-uri si poate
// intra sa editeze pe oricare; un admin obisnuit vede direct doar CV-ul lui.
// Filtrarea reala e facuta de RLS in Supabase — aici doar afisam ce ne intoarce query-ul.

import { useEffect, useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import CVEditor from "@/components/admin/CVEditor";
import { supabase } from "@/lib/supabase";
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

  useEffect(() => {
    if (!profil) return;

    async function incarca() {
      setSeIncarca(true);

      if (esteSuperadmin) {
        // Superadmin: aduce toti cei 4 administratori + CV-ul fiecaruia (daca exista).
        const { data: admini } = await supabase.from("profiles").select("*").order("created_at");
        const { data: cvuri } = await supabase.from("cvs").select("*");

        const combinate: RandCV[] = (admini ?? []).map((admin) => ({
          admin: admin as AdminProfile,
          cv: (cvuri as CV[] | null)?.find((c) => c.admin_id === admin.id) ?? null,
        }));
        setRanduri(combinate);
      } else {
        // Admin obisnuit: doar propriul rand. RLS blocheaza oricum accesul la altele.
        const { data: cvProprie } = await supabase
          .from("cvs")
          .select("*")
          .eq("admin_id", profil.id)
          .maybeSingle();

        setRanduri([{ admin: profil, cv: (cvProprie as CV) ?? null }]);
        setAdminSelectat(profil.id); // admin obisnuit merge direct in editor
      }

      setSeIncarca(false);
    }

    incarca();
  }, [profil, esteSuperadmin]);

  if (seIncarca) return <p className="ogw-loading">Se incarca...</p>;

  // Editorul deschis (fie pentru sine, fie — daca esti superadmin — pentru colegul selectat)
  if (adminSelectat) {
    const rand = randuri.find((r) => r.admin.id === adminSelectat);
    if (rand) {
      return (
        <div>
          {esteSuperadmin && (
            <button className="ogw-btn ogw-btn--ghost ogw-back-btn" onClick={() => setAdminSelectat(null)}>
              ← Inapoi la toate CV-urile
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

  // Lista de carduri — vizibila doar pentru superadmin
  return (
    <div className="ogw-grid ogw-grid--carduri">
      {randuri.map(({ admin, cv }, i) => (
        <GlassPanel key={admin.id} className="ogw-card-cv" intarziereReveal={i * 0.05}>
          <div className="ogw-card-cv__avatar">{admin.nume_afisat[0]?.toUpperCase()}</div>
          <h3>{admin.nume_afisat}</h3>
          <p className="ogw-card-cv__status">
            {cv ? `Status: ${cv.status.replace("_", " ")}` : "Fara CV creat inca"}
          </p>
          <button className="ogw-btn ogw-btn--primar" onClick={() => setAdminSelectat(admin.id)}>
            {cv ? "Deschide & editeaza" : "Creeaza CV"}
          </button>
        </GlassPanel>
      ))}
    </div>
  );
}