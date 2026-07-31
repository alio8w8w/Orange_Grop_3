"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassPanel from "@/components/ui/GlassPanel";
import RepeatableGroup from "@/components/admin/RepeatableGroup";
import FileUploadField from "@/components/admin/FileUploadField";
import { supabase } from "@/lib/supabase/client";
import type {
  CV,
  ExperientaItem,
  EducatieItem,
  LimbaItem,
  PortofoliuItem,
} from "@/types/cv";

const idNou = () => crypto.randomUUID();

const cvGol = (adminId: string): CV => ({
  id: "",
  admin_id: adminId,
  nume: "",
  prenume: "",
  telefon: "",
  email: "",
  localitate: "",
  functie: "",
  poza_url: null,
  data_nasterii: null,
  permis_conducere: [],
  biografie: "",
  descriere: "",
  scrisoare_intentie: "",
  experienta: [],
  educatie: [],
  limbi: [],
  skills: [],
  portofoliu: [],
  documente: [],
  social_links: {},
  status: "ciorna",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

interface CVEditorProps {
  adminId: string;
  cvInitial: CV | null;
  onSalvat?: (cv: CV) => void;
}

function Eticheta({ text, obligatoriu }: { text: string; obligatoriu?: boolean }) {
  return (
    <label className="ogw-field__label" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}>
      {text} {obligatoriu ? <span className="ogw-field__req" style={{ color: "#f97316" }}>*</span> : <span className="ogw-field__opt" style={{ opacity: 0.6, fontSize: "0.8rem" }}>(opțional)</span>}
    </label>
  );
}

export default function CVEditor({ adminId, cvInitial, onSalvat }: CVEditorProps) {
  const [cv, setCv] = useState<CV>(() => {
    if (cvInitial) return cvInitial;
    if (typeof window !== "undefined") {
      const draftSalvat = localStorage.getItem(`cv_draft_${adminId}`);
      if (draftSalvat) {
        try {
          return JSON.parse(draftSalvat);
        } catch (e) {
          console.error("Eroare la parsarea draftului", e);
        }
      }
    }
    return cvGol(adminId);
  });

  const [etapaActiva, setEtapaActiva] = useState<number>(1);
  const [hardSkillNou, setHardSkillNou] = useState("");
  const [nivelHard, setNivelHard] = useState<number>(3);
  const [softSkillNou, setSoftSkillNou] = useState("");
  const [nivelSoft, setNivelSoft] = useState<number>(3);
  const [permisNou, setPermisNou] = useState("");
  const [seIncarcaFisier, setSeIncarcaFisier] = useState(false);
  const [seSalveaza, setSeSalveaza] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "eroare"; text: string } | null>(null);
  const [modPrevizualizare, setModPrevizualizare] = useState(false);

  useEffect(() => {
    if (cv && (cv.nume || cv.email)) {
      localStorage.setItem(`cv_draft_${adminId}`, JSON.stringify(cv));
    }
  }, [cv, adminId]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  function actualizeaza<K extends keyof CV>(camp: K, valoare: CV[K]) {
    setCv((prev) => ({ ...prev, [camp]: valoare }));
  }

  function actualizeazaElementLista<T extends { id: string }>(
    campLista: keyof CV,
    id: string,
    patch: Partial<T>
  ) {
    const listaCurenta = (cv[campLista] as T[]) || [];
    actualizeaza(
      campLista,
      listaCurenta.map((item) => (item.id === id ? { ...item, ...patch } : item)) as CV[keyof CV]
    );
  }

  function adaugaExperienta() {
    const item: ExperientaItem = { id: idNou(), companie: "", functie: "", data_inceput: "" };
    actualizeaza("experienta", [...cv.experienta, item]);
  }

  function adaugaEducatie() {
    const item: EducatieItem = { id: idNou(), institutie: "", specializare: "", nivel: "facultate", data_inceput: "" };
    actualizeaza("educatie", [...cv.educatie, item]);
  }

  function adaugaLimba() {
    const item: LimbaItem = { id: idNou(), limba: "", nivel: "B1" };
    actualizeaza("limbi", [...cv.limbi, item]);
  }

  function adaugaPortofoliu() {
    const item = { id: idNou(), titlu: "", tip_proiect: "website", url: "", imagine_url: null, descriere: "", imagini_url: [] } as any;
    actualizeaza("portofoliu", [...cv.portofoliu, item]);
  }

  function adaugaHardSkill() {
    const valoare = hardSkillNou.trim();
    if (!valoare) return;
    const etichetaNivel = ["Slab", "Mediu", "Bine", "Foarte bine", "Excelent"][nivelHard - 1] || "Bine";
    const skillFormat = `[Hard] ${valoare} (${etichetaNivel})`;
    if (cv.skills.includes(skillFormat)) return;

    actualizeaza("skills", [...cv.skills, skillFormat]);
    setHardSkillNou("");
    setNivelHard(3);
  }

  function adaugaSoftSkill() {
    const valoare = softSkillNou.trim();
    if (!valoare) return;
    const etichetaNivel = ["Slab", "Mediu", "Bine", "Foarte bine", "Excelent"][nivelSoft - 1] || "Bine";
    const skillFormat = `[Soft] ${valoare} (${etichetaNivel})`;
    if (cv.skills.includes(skillFormat)) return;

    actualizeaza("skills", [...cv.skills, skillFormat]);
    setSoftSkillNou("");
    setNivelSoft(3);
  }

  function stergeSkill(skill: string) {
    actualizeaza("skills", cv.skills.filter((s) => s !== skill));
  }

  function adaugaPermis() {
    const valoare = permisNou.trim().toUpperCase();
    if (!valoare || cv.permis_conducere?.includes(valoare)) return;
    actualizeaza("permis_conducere", [...(cv.permis_conducere ?? []), valoare]);
    setPermisNou("");
  }

  function campuriObligatoriiCompletate() {
    return (["nume", "prenume", "telefon", "email", "functie"] as (keyof CV)[]).every(
      (camp) => String(cv[camp] ?? "").trim().length > 0
    );
  }

  async function salveaza() {
    if (!campuriObligatoriiCompletate()) {
      setMesaj({ tip: "eroare", text: "Completează toate câmpurile obligatorii (*) din Info Generale înainte de salvare." });
      setEtapaActiva(1);
      return;
    }
    if (!adminId) {
      setMesaj({ tip: "eroare", text: "Eroare: Lipsește ID-ul administratorului." });
      return;
    }

    setSeSalveaza(true);
    setMesaj(null);

    const { data: adminExistent } = await supabase
      .from("admin_profiles")
      .select("admin_id")
      .eq("admin_id", adminId)
      .single();

    let idValidDeSalvat = adminId;
    if (!adminExistent) {
      const { data: primulAdmin } = await supabase
        .from("admin_profiles")
        .select("admin_id")
        .limit(1)
        .single();
      if (primulAdmin) idValidDeSalvat = primulAdmin.admin_id;
    }

    const payload = {
      ...(cv.id ? { id: cv.id } : {}),
      admin_id: idValidDeSalvat,
      nume: cv.nume || null,
      prenume: cv.prenume || null,
      telefon: cv.telefon || null,
      email: cv.email || null,
      localitate: cv.localitate || null,
      functie: cv.functie || null,
      poza_url: cv.poza_url || null,
      data_nasterii: cv.data_nasterii || null,
      permis_conducere: cv.permis_conducere?.length ? cv.permis_conducere : null,
      biografie: cv.biografie || null,
      descriere: cv.descriere || null,
      scrisoare_intentie: cv.scrisoare_intentie || null,
      experienta: cv.experienta?.length ? cv.experienta : [],
      educatie: cv.educatie?.length ? cv.educatie : [],
      limbi: cv.limbi?.length ? cv.limbi : [],
      skills: cv.skills?.length ? cv.skills : [],
      portofoliu: cv.portofoliu?.length ? cv.portofoliu : [],
      documente: cv.documente?.length ? cv.documente : [],
      social_links: Object.keys(cv.social_links || {}).length ? cv.social_links : {},
      status: cv.status || "ciorna",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("cvs")
      .upsert(payload as any)
      .select()
      .single();

    setSeSalveaza(false);

    if (error) {
      setMesaj({ tip: "eroare", text: `Salvarea a eșuat: ${error.message}` });
      return;
    }

    setCv(data as CV);
    localStorage.removeItem(`cv_draft_${adminId}`);
    setMesaj({ tip: "ok", text: "CV salvat cu succes în Supabase!" });
    onSalvat?.(data as CV);
  }

  return (
    <div className="ogw-editor" style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* Meniul de pași sus */}
      <div className="ogw-steps-menu" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { id: 1, label: "1. Info & Permis" },
          { id: 2, label: "2. Biografie" },
          { id: 3, label: "3. Studii" },
          { id: 4, label: "4. Experiență" },
          { id: 5, label: "5. Competențe & Limbi" },
          { id: 6, label: "6. Portofoliu" },
          { id: 7, label: "7. Status & Salvare" },
        ].map((etapa) => (
          <button
            key={etapa.id}
            type="button"
            disabled={seIncarcaFisier}
            className={`ogw-btn ${etapaActiva === etapa.id ? "ogw-btn--primar" : "ogw-btn--ghost"}`}
            onClick={() => setEtapaActiva(etapa.id)}
            style={{ fontSize: "0.8rem", padding: "0.5rem 0.8rem", opacity: seIncarcaFisier ? 0.5 : 1, cursor: "pointer" }}
          >
            {etapa.label}
          </button>
        ))}
      </div>

      {mesaj && (
        <div style={{ 
          padding: "0.75rem 1rem", 
          borderRadius: "0.5rem", 
          marginBottom: "1rem", 
          background: mesaj.tip === "ok" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
          border: `1px solid ${mesaj.tip === "ok" ? "#22c55e" : "#ef4444"}`,
          color: "#fff",
          fontSize: "0.9rem"
        }}>
          {mesaj.text}
        </div>
      )}

      {seIncarcaFisier && (
        <div style={{ background: "rgba(255, 165, 0, 0.15)", border: "1px solid var(--primary)", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center" }}>
          ⏳ Se încarcă fișierul în Storage... Te rugăm să aștepți înainte de a continua.
        </div>
      )}

      {/* --- ETAPA 1: Informații Generale & Permis --- */}
      {etapaActiva === 1 && (
        <GlassPanel className="ogw-editor__sectiune" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.25rem" }}>Etapa 1: Informații Generale & Permis</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <Eticheta text="Nume" obligatoriu />
              <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} value={cv.nume} onChange={(e) => actualizeaza("nume", e.target.value)} placeholder="Nume" />
            </div>
            <div>
              <Eticheta text="Prenume" obligatoriu />
              <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} value={cv.prenume} onChange={(e) => actualizeaza("prenume", e.target.value)} placeholder="Prenume" />
            </div>
            <div>
              <Eticheta text="Număr de telefon" obligatoriu />
              <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} value={cv.telefon} onChange={(e) => actualizeaza("telefon", e.target.value)} placeholder="07xxxxxxxx" />
            </div>
            <div>
              <Eticheta text="Email" obligatoriu />
              <input type="email" style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} value={cv.email} onChange={(e) => actualizeaza("email", e.target.value)} placeholder="email@exemplu.com" />
            </div>
            <div>
              <Eticheta text="Localitate" />
              <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} value={cv.localitate} onChange={(e) => actualizeaza("localitate", e.target.value)} placeholder="Oraș" />
            </div>
            <div>
              <Eticheta text="Funcția selectată" obligatoriu />
              <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} value={cv.functie || ""} onChange={(e) => actualizeaza("functie", e.target.value)} placeholder="Funcția vizată" />
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <FileUploadField
                eticheta="Fotografie de profil"
                adminId={adminId}
                bucket="poze"
                onIncarcat={(url) => { actualizeaza("poza_url", url); setSeIncarcaFisier(false); }}
              />
            </div>
            {/* FIX: Dimensiuni controlate strict pentru previzualizarea pozei */}
            {cv.poza_url && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Previzualizare poză:</span>
                <img 
                  src={cv.poza_url} 
                  alt="Preview" 
                  style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }} 
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <button type="button" className="ogw-btn ogw-btn--primar" disabled={seIncarcaFisier} onClick={() => setEtapaActiva(2)} style={{ cursor: "pointer" }}>
              Următoarea etapă →
            </button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 2: Prezentare & Biografie --- */}
      {etapaActiva === 2 && (
        <GlassPanel className="ogw-editor__sectiune" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.25rem" }}>Etapa 2: Prezentare & Biografie</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <Eticheta text="Biografie" />
              <textarea style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} rows={3} value={cv.biografie} onChange={(e) => actualizeaza("biografie", e.target.value)} placeholder="Scrie o scurtă biografie..." />
            </div>
            <div>
              <Eticheta text="Descriere scurtă" />
              <textarea style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} rows={2} value={cv.descriere} onChange={(e) => actualizeaza("descriere", e.target.value)} placeholder="Rezumat profesional..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(1)} style={{ cursor: "pointer" }}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(3)} style={{ cursor: "pointer" }}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* Etapele ulterioare (3-7) pot urma același șablon curat, finalizând cu butonul de salvare */}
      {etapaActiva === 7 && (
        <GlassPanel className="ogw-editor__sectiune" style={{ padding: "1.5rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Finalizare și Salvare</h2>
          <p style={{ opacity: "0.8", marginBottom: "1.5rem" }}>Verifică datele introduse și salvează modificările în baza de date.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(6)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={salveaza} disabled={seSalveaza} style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}>
              {seSalveaza ? "Se salvează..." : "Salvează CV-ul în Supabase"}
            </button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}