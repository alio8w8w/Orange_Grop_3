"use client";

// components/admin/CVEditor.tsx

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
    <label className="ogw-field__label">
      {text} {obligatoriu ? <span className="ogw-field__req">*</span> : <span className="ogw-field__opt">opțional</span>}
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
    const item = { id: idNou(), titlu: "", url: "", descriere: "", imagini_url: [] } as any;
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
    // Am exclus localitate, verificam doar campurile esentiale actualizate
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

  if (modPrevizualizare) {
    return (
      <div className="ogw-editor ogw-preview-mode">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2>Previzualizare CV Final</h2>
          <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setModPrevizualizare(false)}>
            ← Înapoi la etape
          </button>
        </div>
        
        <GlassPanel className="ogw-editor__sectiune" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1.25rem" }}>
            {cv.poza_url && <img src={cv.poza_url} alt="Avatar" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover" }} />}
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>{cv.nume} {cv.prenume}</h1>
              <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>{cv.localitate} | {cv.telefon} | {cv.email}</p>
              {cv.functie && <p style={{ color: "var(--primary)", fontWeight: 600, marginTop: "0.25rem" }}>{cv.functie}</p>}
            </div>
          </div>

          {cv.biografie && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ color: "var(--primary)", marginBottom: "0.3rem", fontSize: "1rem" }}>Prezentare & Biografie</h3>
              <p style={{ opacity: 0.9, lineHeight: 1.5, fontSize: "0.9rem" }}>{cv.biografie}</p>
            </div>
          )}

          {cv.skills.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <h3 style={{ color: "var(--primary)", marginBottom: "0.3rem", fontSize: "1rem" }}>Competențe</h3>
              <div className="ogw-tags">
                {cv.skills.map((s, idx) => <span key={idx} className="ogw-tag">{s}</span>)}
              </div>
            </div>
          )}
        </GlassPanel>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}>
          <button type="button" className="ogw-btn ogw-btn--primar" onClick={salveaza} disabled={seSalveaza}>
            {seSalveaza ? "Se salvează..." : "Confirmă și Salvează în Supabase"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ogw-editor">
      <div className="ogw-steps-menu" style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { id: 1, label: "1. Info & Permis" },
          { id: 2, label: "2. Biografie" },
          { id: 3, label: "3. Studii" },
          { id: 4, label: "4. Experiență" },
          { id: 5, label: "5. Competențe & Limbi" },
          { id: 6, label: "6. Portofoliu & Diplome" },
          { id: 7, label: "7. Social & Status" },
        ].map((etapa) => (
          <button
            key={etapa.id}
            type="button"
            disabled={seIncarcaFisier}
            className={`ogw-btn ${etapaActiva === etapa.id ? "ogw-btn--primar" : "ogw-btn--ghost"}`}
            onClick={() => setEtapaActiva(etapa.id)}
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem", opacity: seIncarcaFisier ? 0.5 : 1 }}
          >
            {etapa.label}
          </button>
        ))}
      </div>

      {seIncarcaFisier && (
        <div style={{ background: "rgba(255, 165, 0, 0.15)", border: "1px solid var(--primary)", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center" }}>
          ⏳ Se încarcă fișierul în Storage... Te rugăm să aștepți înainte de a continua.
        </div>
      )}

      {/* --- ETAPA 1: Informații Generale & Permis --- */}
      {etapaActiva === 1 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 1: Informații Generale & Permis</h2>
          <div className="ogw-grid ogw-grid--2">
            <div>
              <Eticheta text="Nume" obligatoriu />
              <input value={cv.nume} onChange={(e) => actualizeaza("nume", e.target.value)} placeholder="Nume" />
            </div>
            <div>
              <Eticheta text="Prenume" obligatoriu />
              <input value={cv.prenume} onChange={(e) => actualizeaza("prenume", e.target.value)} placeholder="Prenume" />
            </div>
            <div>
              <Eticheta text="Număr de telefon" obligatoriu />
              <input value={cv.telefon} onChange={(e) => actualizeaza("telefon", e.target.value)} placeholder="07xxxxxxxx" />
            </div>
            <div>
              <Eticheta text="Email" obligatoriu />
              <input type="email" value={cv.email} onChange={(e) => actualizeaza("email", e.target.value)} placeholder="email@exemplu.com" />
            </div>
            <div>
              <Eticheta text="Localitate" />
              <input value={cv.localitate} onChange={(e) => actualizeaza("localitate", e.target.value)} placeholder="Oraș" />
            </div>
            <div>
              <Eticheta text="Funcția (ex: Web Developer)" obligatoriu />
              <input value={cv.functie || ""} onChange={(e) => actualizeaza("functie", e.target.value)} placeholder="Funcția vizată" />
            </div>
            <div>
              <Eticheta text="Data nașterii" />
              <input type="date" value={cv.data_nasterii ?? ""} onChange={(e) => actualizeaza("data_nasterii", e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <FileUploadField
              eticheta="Fotografie de profil"
              adminId={adminId}
              bucket="poze"
              onIncarcat={(url) => { actualizeaza("poza_url", url); setSeIncarcaFisier(false); }}
            />
          </div>

          {cv.poza_url && <img src={cv.poza_url} alt="Preview" className="ogw-editor__poza-preview" style={{ marginTop: "0.5rem" }} />}

          <div style={{ marginTop: "1.25rem" }}>
            <Eticheta text="Permis de conducere (categorii)" />
            <div className="ogw-tag-input">
              <input
                value={permisNou}
                onChange={(e) => setPermisNou(e.target.value)}
                placeholder="ex: B, C"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adaugaPermis())}
              />
              <button type="button" className="ogw-btn ogw-btn--ghost" onClick={adaugaPermis}>Adaugă</button>
            </div>
            <div className="ogw-tags">
              {(cv.permis_conducere ?? []).map((p) => (
                <span key={p} className="ogw-tag">
                  {p} <button type="button" onClick={() => actualizeaza("permis_conducere", (cv.permis_conducere ?? []).filter((x) => x !== p))}>✕</button>
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <button type="button" className="ogw-btn ogw-btn--primar" disabled={seIncarcaFisier} onClick={() => setEtapaActiva(2)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 2: Prezentare & Biografie --- */}
      {etapaActiva === 2 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 2: Prezentare & Biografie</h2>
          <div>
            <Eticheta text="Biografie" />
            <textarea rows={3} value={cv.biografie} onChange={(e) => actualizeaza("biografie", e.target.value)} placeholder="Scrie o scurtă biografie..." />
          </div>
          <div>
            <Eticheta text="Descriere scurtă" />
            <textarea rows={2} value={cv.descriere} onChange={(e) => actualizeaza("descriere", e.target.value)} placeholder="Rezumat profesional..." />
          </div>
          <div>
            <Eticheta text="Scrisoare de intenție" />
            <textarea rows={4} value={cv.scrisoare_intentie} onChange={(e) => actualizeaza("scrisoare_intentie", e.target.value)} placeholder="Scrisoare de intenție..." />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(1)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(3)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 3: Studii --- */}
      {etapaActiva === 3 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 3: Studii & Educație</h2>
          <RepeatableGroup
            titlu="Instituții de învățământ / Diplome"
            elemente={cv.educatie}
            getId={(e) => e.id}
            onAdauga={adaugaEducatie}
            onSterge={(id) => actualizeaza("educatie", cv.educatie.filter((e) => e.id !== id))}
            textButonAdauga="+ Adaugă studii"
            gol="Nicio instituție adăugată."
            renderItem={(item) => (
              <div className="ogw-grid ogw-grid--2" style={{ marginTop: "0.75rem" }}>
                <input placeholder="Instituție" value={item.institutie} onChange={(e) => actualizeazaElementLista<EducatieItem>("educatie", item.id, { institutie: e.target.value })} />
                <input placeholder="Specializare / Profil" value={item.specializare} onChange={(e) => actualizeazaElementLista<EducatieItem>("educatie", item.id, { specializare: e.target.value })} />
                <select value={item.nivel} onChange={(e) => actualizeazaElementLista<EducatieItem>("educatie", item.id, { nivel: e.target.value as EducatieItem["nivel"] })}>
                  <option value="liceu">Liceu</option><option value="facultate">Facultate</option>
                  <option value="master">Master</option><option value="doctorat">Doctorat</option>
                  <option value="curs">Curs</option><option value="certificare">Certificare</option>
                </select>
                <input type="month" value={item.data_inceput} onChange={(e) => actualizeazaElementLista<EducatieItem>("educatie", item.id, { data_inceput: e.target.value })} />
              </div>
            )}
          />
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(2)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(4)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 4: Experiență --- */}
      {etapaActiva === 4 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 4: Experiență Profesională</h2>
          <RepeatableGroup
            titlu="Locuri de muncă anterioare"
            elemente={cv.experienta}
            getId={(e) => e.id}
            onAdauga={adaugaExperienta}
            onSterge={(id) => actualizeaza("experienta", cv.experienta.filter((e) => e.id !== id))}
            textButonAdauga="+ Adaugă experiență"
            gol="Nicio experiență adăugată."
            renderItem={(item) => (
              <div className="ogw-grid ogw-grid--2" style={{ marginTop: "0.75rem" }}>
                <input placeholder="Companie" value={item.companie} onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { companie: e.target.value })} />
                <input placeholder="Funcție / Post" value={item.functie} onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { functie: e.target.value })} />
                <input type="month" value={item.data_inceput} onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { data_inceput: e.target.value })} />
                <input type="month" value={item.data_sfarsit ?? ""} placeholder="Prezent" onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { data_sfarsit: e.target.value || null })} />
              </div>
            )}
          />
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(3)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(5)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 5: Competențe --- */}
      {etapaActiva === 5 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 5: Competențe & Limbi Străine</h2>
          <div style={{ marginBottom: "1.25rem" }}>
            <Eticheta text="Hard Skills (Abilități Tehnice)" />
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input value={hardSkillNou} onChange={(e) => setHardSkillNou(e.target.value)} placeholder="ex: React, JavaScript..." onKeyDown={(e) => e.key === "Enter" && adaugaHardSkill()} />
              <button type="button" className="ogw-btn ogw-btn--ghost" onClick={adaugaHardSkill}>Adaugă</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Nivel: <strong>{["Slab", "Mediu", "Bine", "Foarte bine", "Excelent"][nivelHard - 1]}</strong></span>
              <input type="range" min="1" max="5" value={nivelHard} onChange={(e) => setNivelHard(Number(e.target.value))} style={{ flex: 1, cursor: "pointer" }} />
            </div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <Eticheta text="Soft Skills (Abilități Personale)" />
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input value={softSkillNou} onChange={(e) => setSoftSkillNou(e.target.value)} placeholder="ex: Comunicare..." onKeyDown={(e) => e.key === "Enter" && adaugaSoftSkill()} />
              <button type="button" className="ogw-btn ogw-btn--ghost" onClick={adaugaSoftSkill}>Adaugă</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Nivel: <strong>{["Slab", "Mediu", "Bine", "Foarte bine", "Excelent"][nivelSoft - 1]}</strong></span>
              <input type="range" min="1" max="5" value={nivelSoft} onChange={(e) => setNivelSoft(Number(e.target.value))} style={{ flex: 1, cursor: "pointer" }} />
            </div>
          </div>
          <div className="ogw-tags" style={{ marginBottom: "1.5rem" }}>
            {cv.skills.map((s) => (
              <span key={s} className="ogw-tag">{s} <button type="button" onClick={() => stergeSkill(s)}>✕</button></span>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
            <RepeatableGroup
              titlu="Limbi Străine"
              elemente={cv.limbi}
              getId={(l) => l.id}
              onAdauga={adaugaLimba}
              onSterge={(id) => actualizeaza("limbi", cv.limbi.filter((l) => l.id !== id))}
              textButonAdauga="+ Adaugă limbă"
              gol="Nicio limbă adăugată."
              renderItem={(item) => (
                <div className="ogw-grid ogw-grid--2" style={{ marginTop: "0.5rem" }}>
                  <input placeholder="Limbă (ex: Engleză)" value={item.limba} onChange={(e) => actualizeazaElementLista<LimbaItem>("limbi", item.id, { limba: e.target.value })} />
                  <select value={item.nivel} onChange={(e) => actualizeazaElementLista<LimbaItem>("limbi", item.id, { nivel: e.target.value as LimbaItem["nivel"] })}>
                    {["A1", "A2", "B1", "B2", "C1", "C2", "nativ"].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              )}
            />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(4)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(6)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 6: Portofoliu & Documente --- */}
      {etapaActiva === 6 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 6: Portofoliu Proiecte & Diplome/Certificate</h2>
          
          <RepeatableGroup
            titlu="Portofoliu Proiecte"
            elemente={cv.portofoliu}
            getId={(p) => p.id}
            onAdauga={adaugaPortofoliu}
            onSterge={(id) => actualizeaza("portofoliu", cv.portofoliu.filter((p) => p.id !== id))}
            textButonAdauga="+ Adaugă proiect"
            gol="Niciun proiect adăugat."
            renderItem={(item: any) => {
              const descriereCurenta = item.descriere || "";
              const nrCuvinte = descriereCurenta.trim().split(/\s+/).filter((w: string) => w.length > 0).length;

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <input
                    placeholder="Titlu proiect"
                    value={item.titlu}
                    onChange={(e) => actualizeazaElementLista<PortofoliuItem>("portofoliu", item.id, { titlu: e.target.value })}
                  />

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Descriere scurtă (maxim 20 cuvinte)..."
                      value={descriereCurenta}
                      onChange={(e) => {
                        const text = e.target.value;
                        const words = text.trim().split(/\s+/).filter((w: string) => w.length > 0);
                        if (words.length <= 20 || text.length < descriereCurenta.length) {
                          actualizeazaElementLista<PortofoliuItem>("portofoliu", item.id, { descriere: text } as any);
                        }
                      }}
                      style={{ 
                        width: "100%", 
                        background: "rgba(255,255,255,0.05)", 
                        border: nrCuvinte >= 20 ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", 
                        padding: "0.75rem", 
                        color: "white" 
                      }}
                    />
                    <div style={{ fontSize: "0.75rem", textAlign: "right", color: nrCuvinte >= 20 ? "#ef4444" : "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>
                      {nrCuvinte} / 20 cuvinte
                    </div>
                  </div>

                  <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", opacity: 0.8 }}>
                      <strong>Prezentare proiect:</strong> Adaugă un link <strong>și/sau</strong> încarcă mai multe imagini (screenshots).
                    </p>
                    
                    <input
                      placeholder="Link (ex: https://github.com/... sau URL live)"
                      value={item.url}
                      onChange={(e) => actualizeazaElementLista<PortofoliuItem>("portofoliu", item.id, { url: e.target.value })}
                      style={{ marginBottom: "1rem" }}
                    />
                    
                    <FileUploadField
                      eticheta="Încarcă imagini pentru acest proiect"
                      adminId={adminId}
                      bucket="portofoliu"
                      acceptaMultiplu={true}
                      onIncarcat={(url) => {
                        setCv(prevCv => {
                          const portofoliuActualizat = prevCv.portofoliu.map(p => {
                            if (p.id === item.id) {
                              const imaginiCurente = (p as any).imagini_url || [];
                              return { ...p, imagini_url: [...imaginiCurente, url] };
                            }
                            return p;
                          });
                          return { ...prevCv, portofoliu: portofoliuActualizat };
                        });
                        setSeIncarcaFisier(false);
                      }}
                    />

                    {item.imagini_url && item.imagini_url.length > 0 && (
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
                        {item.imagini_url.map((imgUrl: string, idx: number) => (
                          <div key={idx} style={{ position: "relative", width: "90px", height: "90px" }}>
                            <img 
                              src={imgUrl} 
                              alt={`Preview ${idx + 1}`} 
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }} 
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const noiImagini = item.imagini_url.filter((u: string) => u !== imgUrl);
                                actualizeazaElementLista<any>("portofoliu", item.id, { imagini_url: noiImagini });
                              }}
                              style={{ position: "absolute", top: "-6px", right: "-6px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />

          <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
            <FileUploadField
              eticheta="Încarcă Diplome / Certificate (Secțiune separată de portofoliu)"
              adminId={adminId}
              bucket="documente"
              acceptaMultiplu
              tipuriAcceptate="image/*,.pdf"
              onIncarcat={(url, numeFisier) => {
                actualizeaza("documente", [
                  ...cv.documente,
                  { id: idNou(), nume_fisier: numeFisier, url, tip: "diploma", data_incarcare: new Date().toISOString() },
                ]);
                setSeIncarcaFisier(false);
              }}
            />
            <ul className="ogw-doc-list" style={{ marginTop: "0.5rem" }}>
              {cv.documente.map((doc) => (
                <li key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.3rem 0" }}>
                  <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>📄 {doc.nume_fisier}</a>
                  <button type="button" onClick={() => actualizeaza("documente", cv.documente.filter((d) => d.id !== doc.id))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(5)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(7)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 7: Social & Salvare --- */}
      {etapaActiva === 7 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 7: Rețele Sociale & Finalizare</h2>
          <div className="ogw-grid ogw-grid--2" style={{ marginBottom: "1rem" }}>
            {(["facebook", "instagram", "linkedin", "tiktok"] as const).map((retea) => (
              <div key={retea}>
                <Eticheta text={retea[0].toUpperCase() + retea.slice(1)} />
                <input placeholder="https://..." value={cv.social_links[retea] ?? ""} onChange={(e) => actualizeaza("social_links", { ...cv.social_links, [retea]: e.target.value })} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <Eticheta text="Status CV" />
            <select value={cv.status} onChange={(e) => actualizeaza("status", e.target.value as CV["status"])}>
              <option value="ciorna">Ciornă</option><option value="in_lucru">În lucru</option>
              <option value="complet">Complet</option><option value="publicat">Publicat</option>
            </select>
          </div>

          <div className="ogw-editor__butoane" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(6)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setModPrevizualizare(true)}>Previzualizează CV-ul</button>
            <motion.button type="button" className="ogw-btn ogw-btn--primar" onClick={salveaza} disabled={seSalveaza || seIncarcaFisier} whileTap={{ scale: 0.97 }}>
              {seSalveaza ? "Se salvează..." : "Salvează în Supabase"}
            </motion.button>
          </div>

          {mesaj && <p className={mesaj.tip === "ok" ? "ogw-mesaj ogw-mesaj--ok" : "ogw-mesaj ogw-mesaj--eroare"} style={{ marginTop: "0.75rem" }}>{mesaj.text}</p>}
        </GlassPanel>
      )}
    </div>
  );
}