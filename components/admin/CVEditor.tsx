"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassPanel from "@/components/ui/GlassPanel";
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
    <label style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500, color: "#f97316" }}>
      {text} {obligatoriu ? <span style={{ color: "#f97316" }}>*</span> : <span style={{ opacity: 0.6, fontSize: "0.8rem", color: "#fb923c" }}>(opțional)</span>}
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
    const item: ExperientaItem = { id: idNou(), companie: "", functie: "", data_inceput: "", data_sfarsit: "", descriere: "" };
    actualizeaza("experienta", [...cv.experienta, item]);
  }

  function stergeExperienta(id: string) {
    actualizeaza("experienta", cv.experienta.filter((item) => item.id !== id));
  }

  function adaugaEducatie() {
    const item: EducatieItem = { id: idNou(), institutie: "", specializare: "", nivel: "facultate", data_inceput: "", data_sfarsit: "" };
    actualizeaza("educatie", [...cv.educatie, item]);
  }

  function stergeEducatie(id: string) {
    actualizeaza("educatie", cv.educatie.filter((item) => item.id !== id));
  }

  function adaugaLimba() {
    const item: LimbaItem = { id: idNou(), limba: "", nivel: "B1" };
    actualizeaza("limbi", [...cv.limbi, item]);
  }

  function adaugaPortofoliu() {
    const item = { id: idNou(), titlu: "", tip_proiect: "website", url: "", imagine_url: null, descriere: "", imagini_url: [] } as any;
    actualizeaza("portofoliu", [...cv.portofoliu, item]);
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

  const butonOrangeStyle = {
    background: "#f97316",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "0.5rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
    transition: "background 0.2s",
  };

  const butonInapoiStyle = {
    background: "rgba(249, 115, 22, 0.15)",
    color: "#f97316",
    border: "1px solid #f97316",
    padding: "0.6rem 1.2rem",
    borderRadius: "0.5rem",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: "950px", margin: "0 auto", paddingBottom: "3rem", color: "#fff" }}>
      {/* Meniul de pași în format Glassmorphism */}
      <GlassPanel style={{ padding: "1rem", marginBottom: "1.5rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
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
              onClick={() => setEtapaActiva(etapa.id)}
              style={{
                fontSize: "0.85rem",
                padding: "0.5rem 0.9rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: etapaActiva === etapa.id ? 700 : 500,
                background: etapaActiva === etapa.id ? "#f97316" : "rgba(255, 255, 255, 0.05)",
                color: etapaActiva === etapa.id ? "#fff" : "#f97316",
                border: "1px solid rgba(249, 115, 22, 0.4)",
                opacity: seIncarcaFisier ? 0.5 : 1,
              }}
            >
              {etapa.label}
            </button>
          ))}
        </div>
      </GlassPanel>

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
        <div style={{ background: "rgba(249, 115, 22, 0.15)", border: "1px solid #f97316", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center", color: "#f97316" }}>
          ⏳ Se încarcă fișierul în Storage... Te rugăm să aștepți înainte de a continua.
        </div>
      )}

      {/* --- ETAPA 1: Informații Generale & Permis --- */}
      {etapaActiva === 1 && (
        <GlassPanel style={{ padding: "2rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1.5rem", color: "#f97316" }}>Etapa 1: Informații Generale & Permis</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <Eticheta text="Nume" obligatoriu />
              <input style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} value={cv.nume} onChange={(e) => actualizeaza("nume", e.target.value)} placeholder="Nume" />
            </div>
            <div>
              <Eticheta text="Prenume" obligatoriu />
              <input style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} value={cv.prenume} onChange={(e) => actualizeaza("prenume", e.target.value)} placeholder="Prenume" />
            </div>
            <div>
              <Eticheta text="Număr de telefon" obligatoriu />
              <input style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} value={cv.telefon} onChange={(e) => actualizeaza("telefon", e.target.value)} placeholder="07xxxxxxxx" />
            </div>
            <div>
              <Eticheta text="Email" obligatoriu />
              <input type="email" style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} value={cv.email} onChange={(e) => actualizeaza("email", e.target.value)} placeholder="email@exemplu.com" />
            </div>
            <div>
              <Eticheta text="Localitate" />
              <input style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} value={cv.localitate} onChange={(e) => actualizeaza("localitate", e.target.value)} placeholder="Oraș" />
            </div>
            <div>
              <Eticheta text="Funcția selectată" obligatoriu />
              <input style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} value={cv.functie || ""} onChange={(e) => actualizeaza("functie", e.target.value)} placeholder="Funcția vizată" />
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "0.75rem", border: "1px solid rgba(249,115,22,0.2)" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <FileUploadField
                eticheta="Fotografie de profil"
                adminId={adminId}
                bucket="poze"
                onIncarcat={(url) => { actualizeaza("poza_url", url); setSeIncarcaFisier(false); }}
              />
            </div>
            {cv.poza_url && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#f97316" }}>Previzualizare poză:</span>
                <img 
                  src={cv.poza_url} 
                  alt="Preview" 
                  style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f97316" }} 
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" style={butonOrangeStyle} disabled={seIncarcaFisier} onClick={() => setEtapaActiva(2)}>
              Următoarea etapă →
            </button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 2: Prezentare & Biografie --- */}
      {etapaActiva === 2 && (
        <GlassPanel style={{ padding: "2rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1.5rem", color: "#f97316" }}>Etapa 2: Prezentare & Biografie</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <Eticheta text="Biografie" />
              <textarea style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} rows={3} value={cv.biografie} onChange={(e) => actualizeaza("biografie", e.target.value)} placeholder="Scrie o scurtă biografie..." />
            </div>
            <div>
              <Eticheta text="Descriere scurtă" />
              <textarea style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.4)", color: "#fff" }} rows={2} value={cv.descriere} onChange={(e) => actualizeaza("descriere", e.target.value)} placeholder="Rezumat profesional..." />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <button type="button" style={butonInapoiStyle} onClick={() => setEtapaActiva(1)}>← Înapoi</button>
            <button type="button" style={butonOrangeStyle} onClick={() => setEtapaActiva(3)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 3: Studii & Educație --- */}
      {etapaActiva === 3 && (
        <GlassPanel style={{ padding: "2rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, color: "#f97316" }}>Etapa 3: Studii & Educație</h2>
            <button type="button" style={butonOrangeStyle} onClick={adaugaEducatie}>+ Adaugă studii</button>
          </div>

          {cv.educatie.length === 0 ? (
            <p style={{ color: "#fb923c", fontStyle: "italic", textAlign: "center", padding: "2rem 0" }}>Niciun studiu adăugat momentan. Apasă pe butonul de sus pentru a adăuga.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {cv.educatie.map((edu, index) => (
                <div key={edu.id} style={{ padding: "1.25rem", borderRadius: "0.75rem", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(249,115,22,0.3)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", position: "relative" }}>
                  <div>
                    <Eticheta text="Nume instituție" obligatoriu />
                    <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={edu.institutie} onChange={(e) => actualizeazaElementLista("educatie", edu.id, { institutie: e.target.value })} placeholder="ex: Universitatea Tehnică a Moldovei" />
                  </div>
                  <div>
                    <Eticheta text="Specializare / Domeniu" obligatoriu />
                    <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={edu.specializare} onChange={(e) => actualizeazaElementLista("educatie", edu.id, { specializare: e.target.value })} placeholder="ex: Calculatoare și Rețele" />
                  </div>
                  <div>
                    <Eticheta text="Ciclul de studii" />
                    <select style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "#1a1008", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={edu.nivel} onChange={(e) => actualizeazaElementLista("educatie", edu.id, { nivel: e.target.value as any })}>
                      <option value="liceu">Liceu</option>
                      <option value="facultate">Licență (Facultate)</option>
                      <option value="masterat">Masterat</option>
                      <option value="doctorat">Doctorat</option>
                      <option value="altul">Altele</option>
                    </select>
                  </div>
                  <div>
                    <Eticheta text="An început / An finisaj (sau Prezent)" />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={{ width: "50%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={edu.data_inceput} onChange={(e) => actualizeazaElementLista("educatie", edu.id, { data_inceput: e.target.value })} placeholder="Început" />
                      <input style={{ width: "50%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={edu.data_sfarsit || ""} onChange={(e) => actualizeazaElementLista("educatie", edu.id, { data_sfarsit: e.target.value })} placeholder="Sfârșit/Prezent" />
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => stergeEducatie(edu.id)} style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid #ef4444", padding: "0.35rem 0.75rem", borderRadius: "0.35rem", cursor: "pointer", fontSize: "0.8rem" }}>
                      🗑️ Șterge studiu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <button type="button" style={butonInapoiStyle} onClick={() => setEtapaActiva(2)}>← Înapoi</button>
            <button type="button" style={butonOrangeStyle} onClick={() => setEtapaActiva(4)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 4: Experiență Profesională --- */}
      {etapaActiva === 4 && (
        <GlassPanel style={{ padding: "2rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, color: "#f97316" }}>Etapa 4: Experiență Profesională</h2>
            <button type="button" style={butonOrangeStyle} onClick={adaugaExperienta}>+ Adaugă experiență</button>
          </div>

          {cv.experienta.length === 0 ? (
            <p style={{ color: "#fb923c", fontStyle: "italic", textAlign: "center", padding: "2rem 0" }}>Nicio experiență adăugată momentan. Apasă pe butonul de sus pentru a adăuga.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {cv.experienta.map((exp) => (
                <div key={exp.id} style={{ padding: "1.25rem", borderRadius: "0.75rem", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <div>
                      <Eticheta text="Companie" obligatoriu />
                      <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={exp.companie} onChange={(e) => actualizeazaElementLista("experienta", exp.id, { companie: e.target.value })} placeholder="Nume companie" />
                    </div>
                    <div>
                      <Eticheta text="Funcție / Rol" obligatoriu />
                      <input style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={exp.functie} onChange={(e) => actualizeazaElementLista("experienta", exp.id, { functie: e.target.value })} placeholder="ex: Full Stack Developer" />
                    </div>
                    <div>
                      <Eticheta text="Perioadă (Început - Sfârșit)" />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input style={{ width: "50%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={exp.data_inceput} onChange={(e) => actualizeazaElementLista("experienta", exp.id, { data_inceput: e.target.value })} placeholder="Lună/An" />
                        <input style={{ width: "50%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={exp.data_sfarsit || ""} onChange={(e) => actualizeazaElementLista("experienta", exp.id, { data_sfarsit: e.target.value })} placeholder="Prezent" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Eticheta text="Descriere responsabilități" />
                    <textarea style={{ width: "100%", padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} rows={2} value={exp.descriere || ""} onChange={(e) => actualizeazaElementLista("experienta", exp.id, { descriere: e.target.value })} placeholder="Ce ai făcut în cadrul acestui rol..." />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => stergeExperienta(exp.id)} style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid #ef4444", padding: "0.35rem 0.75rem", borderRadius: "0.35rem", cursor: "pointer", fontSize: "0.8rem" }}>
                      🗑️ Șterge experiență
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <button type="button" style={butonInapoiStyle} onClick={() => setEtapaActiva(3)}>← Înapoi</button>
            <button type="button" style={butonOrangeStyle} onClick={() => setEtapaActiva(5)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 5: Competențe & Limbi --- */}
      {etapaActiva === 5 && (
        <GlassPanel style={{ padding: "2rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1.5rem", color: "#f97316" }}>Etapa 5: Competențe & Limbi Străine</h2>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <Eticheta text="Adaugă Hard Skill (tehnologii, unelte)" />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <input style={{ flex: 1, padding: "0.5rem", borderRadius: "0.35rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff" }} value={hardSkillNou} onChange={(e) => setHardSkillNou(e.target.value)} placeholder="ex: React, Next.js, Python" />
              <button type="button" style={butonOrangeStyle} onClick={() => {
                if(!hardSkillNou.trim()) return;
                actualizeaza("skills", [...cv.skills, `[Hard] ${hardSkillNou.trim()}`]);
                setHardSkillNou("");
              }}>Adaugă skill</button>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {cv.skills.map((skill, idx) => (
              <span key={idx} style={{ background: "rgba(249, 115, 22, 0.15)", border: "1px solid #f97316", padding: "0.35rem 0.75rem", borderRadius: "1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {skill}
                <button type="button" onClick={() => actualizeaza("skills", cv.skills.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", fontWeight: "bold" }}>×</button>
              </span>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <button type="button" style={butonInapoiStyle} onClick={() => setEtapaActiva(4)}>← Înapoi</button>
            <button type="button" style={butonOrangeStyle} onClick={() => setEtapaActiva(6)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 6: Portofoliu --- */}
      {etapaActiva === 6 && (
        <GlassPanel style={{ padding: "2rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, color: "#f97316" }}>Etapa 6: Portofoliu</h2>
            <button type="button" style={butonOrangeStyle} onClick={adaugaPortofoliu}>+ Adaugă proiect</button>
          </div>

          {cv.portofoliu.length === 0 ? (
            <p style={{ color: "#fb923c", fontStyle: "italic", textAlign: "center", padding: "2rem 0" }}>Niciun proiect în portofoliu.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cv.portofoliu.map((p, idx) => (
                <div key={p.id} style={{ padding: "1rem", background: "rgba(0,0,0,0.25)", borderRadius: "0.5rem", border: "1px solid rgba(249,115,22,0.3)", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input style={{ flex: 1, padding: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff", borderRadius: "0.35rem" }} value={p.titlu} onChange={(e) => {
                    const l = [...cv.portofoliu];
                    l[idx].titlu = e.target.value;
                    actualizeaza("portofoliu", l);
                  }} placeholder="Titlu proiect" />
                  <input style={{ flex: 1, padding: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.3)", color: "#fff", borderRadius: "0.35rem" }} value={p.url || ""} onChange={(e) => {
                    const l = [...cv.portofoliu];
                    l[idx].url = e.target.value;
                    actualizeaza("portofoliu", l);
                  }} placeholder="Link URL" />
                  <button type="button" onClick={() => actualizeaza("portofoliu", cv.portofoliu.filter((_, i) => i !== idx))} style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid #ef4444", padding: "0.5rem", borderRadius: "0.35rem", cursor: "pointer" }}>Șterge</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
            <button type="button" style={butonInapoiStyle} onClick={() => setEtapaActiva(5)}>← Înapoi</button>
            <button type="button" style={butonOrangeStyle} onClick={() => setEtapaActiva(7)}>Următoarea etapă →</button>
          </div>
        </GlassPanel>
      )}

      {/* --- ETAPA 7: Status & Salvare --- */}
      {etapaActiva === 7 && (
        <GlassPanel style={{ padding: "2rem", borderRadius: "1rem", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1rem", color: "#f97316" }}>Etapa 7: Finalizare și Salvare</h2>
          <p style={{ color: "#fb923c", marginBottom: "1.5rem" }}>Verifică datele introduse și salvează modificările direct în baza de date Supabase.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button type="button" style={butonInapoiStyle} onClick={() => setEtapaActiva(6)}>← Înapoi</button>
            <button type="button" style={butonOrangeStyle} onClick={salveaza} disabled={seSalveaza}>
              {seSalveaza ? "Se salvează..." : "Salvează CV-ul în Supabase"}
            </button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}