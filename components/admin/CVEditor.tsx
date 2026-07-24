"use client";

// components/admin/CVEditor.tsx

import { useState } from "react";
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
  const [cv, setCv] = useState<CV>(cvInitial ?? cvGol(adminId));
  const [etapaActiva, setEtapaActiva] = useState<number>(1);

  const [hardSkillNou, setHardSkillNou] = useState("");
  const [nivelHard, setNivelHard] = useState<number>(3);
  const [softSkillNou, setSoftSkillNou] = useState("");
  const [nivelSoft, setNivelSoft] = useState<number>(3);

  const [permisNou, setPermisNou] = useState("");
  const [seSalveaza, setSeSalveaza] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "eroare"; text: string } | null>(null);
  const [modPrevizualizare, setModPrevizualizare] = useState(false);

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
    const item: EducatieItem = {
      id: idNou(),
      institutie: "",
      specializare: "",
      nivel: "facultate",
      data_inceput: "",
    };
    actualizeaza("educatie", [...cv.educatie, item]);
  }

  function adaugaLimba() {
    const item: LimbaItem = { id: idNou(), limba: "", nivel: "B1" };
    actualizeaza("limbi", [...cv.limbi, item]);
  }

  function adaugaPortofoliu() {
    const item: PortofoliuItem = { id: idNou(), titlu: "", url: "" };
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
    return (["nume", "prenume", "telefon", "email", "localitate"] as (keyof CV)[]).every(
      (camp) => String(cv[camp] ?? "").trim().length > 0
    );
  }

  async function salveaza() {
    if (!campuriObligatoriiCompletate()) {
      setMesaj({ tip: "eroare", text: "Completează toate câmpurile obligatorii (*) înainte de salvare." });
      return;
    }

    if (!adminId) {
      setMesaj({ tip: "eroare", text: "Eroare: Lipsește ID-ul administratorului." });
      return;
    }

    setSeSalveaza(true);
    setMesaj(null);

    const payload = {
      ...(cv.id ? { id: cv.id } : {}),
      admin_id: adminId,
      nume: cv.nume || null,
      prenume: cv.prenume || null,
      telefon: cv.telefon || null,
      email: cv.email || null,
      localitate: cv.localitate || null,
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
    setMesaj({ tip: "ok", text: "CV salvat cu succes în Supabase!" });
    onSalvat?.(data as CV);
  }

  async function sterge() {
    if (!cv.id) return;
    const confirmare = window.confirm("Sigur ștergi acest CV?");
    if (!confirmare) return;

    const { error } = await supabase.from("cvs").delete().eq("id", cv.id);
    if (error) {
      setMesaj({ tip: "eroare", text: `Ștergerea a eșuat: ${error.message}` });
      return;
    }
    setCv(cvGol(adminId));
    setMesaj({ tip: "ok", text: "CV șters." });
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
      {/* --- MENIU ETAPE SUS --- */}
      <div className="ogw-steps-menu" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { id: 1, label: "1. Info Generale" },
          { id: 2, label: "2. Biografie" },
          { id: 3, label: "3. Studii & Experiență" },
          { id: 4, label: "4. Competențe" },
          { id: 5, label: "5. Portofoliu & Social" },
        ].map((etapa) => (
          <button
            key={etapa.id}
            type="button"
            className={`ogw-btn ${etapaActiva === etapa.id ? "ogw-btn--primar" : "ogw-btn--ghost"}`}
            onClick={() => setEtapaActiva(etapa.id)}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
          >
            {etapa.label}
          </button>
        ))}
      </div>

      {/* --- ETAPA 1: Informații Generale --- */}
      {etapaActiva === 1 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 1: Informații Generale</h2>
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
              <Eticheta text="Localitate" obligatoriu />
              <input value={cv.localitate} onChange={(e) => actualizeaza("localitate", e.target.value)} placeholder="Oraș" />
            </div>
            <div>
              <Eticheta text="Data nașterii" />
              <input
                type="date"
                value={cv.data_nasterii ?? ""}
                onChange={(e) => actualizeaza("data_nasterii", e.target.value)}
              />
            </div>
          </div>

          <FileUploadField
            eticheta="Fotografie de profil"
            adminId={adminId}
            bucket="poze"
            onIncarcat={(url) => actualizeaza("poza_url", url)}
          />
          {cv.poza_url && (
            <img src={cv.poza_url} alt="Previzualizare" className="ogw-editor__poza-preview" />
          )}

          <div style={{ marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(2)}>
              Următoarea etapă →
            </button>
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
            <textarea
              rows={4}
              value={cv.scrisoare_intentie}
              onChange={(e) => actualizeaza("scrisoare_intentie", e.target.value)}
              placeholder="Scrisoare de intenție..."
            />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(1)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(3)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 3: Educație & Experiență --- */}
      {etapaActiva === 3 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 3: Educație & Experiență Profesională</h2>
          
          <RepeatableGroup
            titlu="Experiență profesională"
            elemente={cv.experienta}
            getId={(e) => e.id}
            onAdauga={adaugaExperienta}
            onSterge={(id) => actualizeaza("experienta", cv.experienta.filter((e) => e.id !== id))}
            textButonAdauga="+ Adaugă experiență"
            gol="Nicio experiență adăugată."
            renderItem={(item) => (
              <div className="ogw-grid ogw-grid--2" style={{ marginTop: "0.75rem" }}>
                <input
                  placeholder="Companie"
                  value={item.companie}
                  onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { companie: e.target.value })}
                />
                <input
                  placeholder="Funcție"
                  value={item.functie}
                  onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { functie: e.target.value })}
                />
                <input
                  type="month"
                  value={item.data_inceput}
                  onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { data_inceput: e.target.value })}
                />
                <input
                  type="month"
                  value={item.data_sfarsit ?? ""}
                  placeholder="Prezent"
                  onChange={(e) => actualizeazaElementLista<ExperientaItem>("experienta", item.id, { data_sfarsit: e.target.value || null })}
                />
              </div>
            )}
          />

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(2)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(4)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 4: Competențe --- */}
      {etapaActiva === 4 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 4: Competențe & Limbi Străine</h2>
          
          <div style={{ marginBottom: "1rem" }}>
            <Eticheta text="Hard Skills" />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={hardSkillNou}
                onChange={(e) => setHardSkillNou(e.target.value)}
                placeholder="ex: React, Node.js..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adaugaHardSkill())}
              />
              <button type="button" className="ogw-btn ogw-btn--ghost" onClick={adaugaHardSkill}>Adaugă</button>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <Eticheta text="Soft Skills" />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={softSkillNou}
                onChange={(e) => setSoftSkillNou(e.target.value)}
                placeholder="ex: Comunicare..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adaugaSoftSkill())}
              />
              <button type="button" className="ogw-btn ogw-btn--ghost" onClick={adaugaSoftSkill}>Adaugă</button>
            </div>
          </div>

          <div className="ogw-tags">
            {cv.skills.map((s) => (
              <span key={s} className="ogw-tag">
                {s}
                <button type="button" onClick={() => stergeSkill(s)}>✕</button>
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(3)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--primar" onClick={() => setEtapaActiva(5)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 5: Portofoliu, Social & Salvare --- */}
      {etapaActiva === 5 && (
        <GlassPanel className="ogw-editor__sectiune">
          <h2>Etapa 5: Portofoliu, Social & Finalizare</h2>
          
          <RepeatableGroup
            titlu="Portofoliu Proiecte"
            elemente={cv.portofoliu}
            getId={(p) => p.id}
            onAdauga={adaugaPortofoliu}
            onSterge={(id) => actualizeaza("portofoliu", cv.portofoliu.filter((p) => p.id !== id))}
            textButonAdauga="+ Adaugă proiect"
            gol="Niciun proiect adăugat."
            renderItem={(item) => (
              <div className="ogw-grid ogw-grid--2" style={{ marginTop: "0.5rem" }}>
                <input
                  placeholder="Titlu proiect"
                  value={item.titlu}
                  onChange={(e) => actualizeazaElementLista<PortofoliuItem>("portofoliu", item.id, { titlu: e.target.value })}
                />
                <input
                  placeholder="Link (URL)"
                  value={item.url}
                  onChange={(e) => actualizeazaElementLista<PortofoliuItem>("portofoliu", item.id, { url: e.target.value })}
                />
              </div>
            )}
          />

          <div style={{ marginTop: "1.5rem" }}>
            <FileUploadField
              eticheta="Încarcă diplomă / certificat"
              adminId={adminId}
              bucket="documente"
              acceptaMultiplu
              tipuriAcceptate="image/*,.pdf"
              onIncarcat={(url, numeFisier) =>
                actualizeaza("documente", [
                  ...cv.documente,
                  { id: idNou(), nume_fisier: numeFisier, url, tip: "diploma", data_incarcare: new Date().toISOString() },
                ])
              }
            />
          </div>

          <div className="ogw-editor__butoane" style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setEtapaActiva(4)}>← Înapoi</button>
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={() => setModPrevizualizare(true)}>
              Previzualizează CV-ul
            </button>
            <motion.button
              type="button"
              className="ogw-btn ogw-btn--primar"
              onClick={salveaza}
              disabled={seSalveaza}
              whileTap={{ scale: 0.97 }}
            >
              {seSalveaza ? "Se salvează..." : "Salvează în Supabase"}
            </motion.button>
          </div>

          {mesaj && (
            <p className={mesaj.tip === "ok" ? "ogw-mesaj ogw-mesaj--ok" : "ogw-mesaj ogw-mesaj--eroare"} style={{ marginTop: "0.75rem" }}>
              {mesaj.text}
            </p>
          )}
        </GlassPanel>
      )}
    </div>
  );
}