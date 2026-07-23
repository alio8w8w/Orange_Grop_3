"use client";

// components/admin/CVEditor.tsx
// Formularul complet de redactare CV. Un singur admin editeaza DOAR CV-ul lui
// (adminId vine din profilul logat), exceptie: superadmin poate primi orice
// adminId ca sa editeze CV-ul oricarui coleg (vezi CVDashboard).

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
  cvInitial: CV | null; // null = se creeaza primul CV pentru acest admin
  onSalvat?: (cv: CV) => void;
}

function Eticheta({ text, obligatoriu }: { text: string; obligatoriu?: boolean }) {
  return (
    <label className="ogw-field__label">
      {text} {obligatoriu ? <span className="ogw-field__req">*</span> : <span className="ogw-field__opt">optional</span>}
    </label>
  );
}

export default function CVEditor({ adminId, cvInitial, onSalvat }: CVEditorProps) {
  const [cv, setCv] = useState<CV>(cvInitial ?? cvGol(adminId));
  const [skillNou, setSkillNou] = useState("");
  const [permisNou, setPermisNou] = useState("");
  const [seSalveaza, setSeSalveaza] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "eroare"; text: string } | null>(null);

  function actualizeaza<K extends keyof CV>(camp: K, valoare: CV[K]) {
    setCv((prev) => ({ ...prev, [camp]: valoare }));
  }

  // --- Experienta ---
  function adaugaExperienta() {
    const item: ExperientaItem = { id: idNou(), companie: "", functie: "", data_inceput: "" };
    actualizeaza("experienta", [...cv.experienta, item]);
  }
  function actualizeazaExperienta(id: string, patch: Partial<ExperientaItem>) {
    actualizeaza(
      "experienta",
      cv.experienta.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  }

  // --- Educatie ---
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
  function actualizeazaEducatie(id: string, patch: Partial<EducatieItem>) {
    actualizeaza(
      "educatie",
      cv.educatie.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  }

  // --- Limbi ---
  function adaugaLimba() {
    const item: LimbaItem = { id: idNou(), limba: "", nivel: "B1" };
    actualizeaza("limbi", [...cv.limbi, item]);
  }
  function actualizeazaLimba(id: string, patch: Partial<LimbaItem>) {
    actualizeaza(
      "limbi",
      cv.limbi.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  }

  // --- Portofoliu ---
  function adaugaPortofoliu() {
    const item: PortofoliuItem = { id: idNou(), titlu: "", url: "" };
    actualizeaza("portofoliu", [...cv.portofoliu, item]);
  }
  function actualizeazaPortofoliu(id: string, patch: Partial<PortofoliuItem>) {
    actualizeaza(
      "portofoliu",
      cv.portofoliu.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  // --- Skills ---
  function adaugaSkill() {
    const valoare = skillNou.trim();
    if (!valoare || cv.skills.includes(valoare)) return;
    actualizeaza("skills", [...cv.skills, valoare]);
    setSkillNou("");
  }
  function stergeSkill(skill: string) {
    actualizeaza("skills", cv.skills.filter((s) => s !== skill));
  }

  // --- Permis ---
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
      setMesaj({ tip: "eroare", text: "Completeaza toate campurile obligatorii (*) inainte de salvare." });
      return;
    }

    setSeSalveaza(true);
    setMesaj(null);

    const payload = { ...cv, admin_id: adminId, updated_at: new Date().toISOString() };

    const { id, ...payloadFaraId } = payload;
    const dateDeSalvat = cv.id ? payload : payloadFaraId;

    const { data, error } = await supabase
      .from("cvs")
      .upsert(dateDeSalvat)
      .select()
      .single();

    setSeSalveaza(false);

    if (error) {
      setMesaj({ tip: "eroare", text: `Salvarea a esuat: ${error.message}` });
      return;
    }

    setCv(data as CV);
    setMesaj({ tip: "ok", text: "CV salvat cu succes." });
    onSalvat?.(data as CV);
  }

  async function sterge() {
    if (!cv.id) return;
    const confirmare = window.confirm("Sigur stergi acest CV? Actiunea nu poate fi anulata.");
    if (!confirmare) return;

    const { error } = await supabase.from("cvs").delete().eq("id", cv.id);
    if (error) {
      setMesaj({ tip: "eroare", text: `Stergerea a esuat: ${error.message}` });
      return;
    }
    setCv(cvGol(adminId));
    setMesaj({ tip: "ok", text: "CV sters." });
  }

  return (
    <div className="ogw-editor">
      {/* --- Date personale --- */}
      <GlassPanel className="ogw-editor__sectiune">
        <h2>Date personale</h2>
        <div className="ogw-grid ogw-grid--2">
          <div>
            <Eticheta text="Nume" obligatoriu />
            <input value={cv.nume} onChange={(e) => actualizeaza("nume", e.target.value)} />
          </div>
          <div>
            <Eticheta text="Prenume" obligatoriu />
            <input value={cv.prenume} onChange={(e) => actualizeaza("prenume", e.target.value)} />
          </div>
          <div>
            <Eticheta text="Numar de telefon" obligatoriu />
            <input value={cv.telefon} onChange={(e) => actualizeaza("telefon", e.target.value)} />
          </div>
          <div>
            <Eticheta text="Email" obligatoriu />
            <input type="email" value={cv.email} onChange={(e) => actualizeaza("email", e.target.value)} />
          </div>
          <div>
            <Eticheta text="Localitate" obligatoriu />
            <input value={cv.localitate} onChange={(e) => actualizeaza("localitate", e.target.value)} />
          </div>
          <div>
            <Eticheta text="Data nasterii" />
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

        <div>
          <Eticheta text="Permis de conducere (categorii)" />
          <div className="ogw-tag-input">
            <input
              value={permisNou}
              onChange={(e) => setPermisNou(e.target.value)}
              placeholder="ex: B"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adaugaPermis())}
            />
            <button type="button" className="ogw-btn ogw-btn--ghost" onClick={adaugaPermis}>
              Adauga
            </button>
          </div>
          <div className="ogw-tags">
            {(cv.permis_conducere ?? []).map((p) => (
              <span key={p} className="ogw-tag">
                {p}
                <button
                  type="button"
                  onClick={() =>
                    actualizeaza(
                      "permis_conducere",
                      (cv.permis_conducere ?? []).filter((x) => x !== p)
                    )
                  }
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* --- Continut narativ --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.05}>
        <h2>Biografie & prezentare</h2>
        <div>
          <Eticheta text="Biografie" />
          <textarea rows={4} value={cv.biografie} onChange={(e) => actualizeaza("biografie", e.target.value)} />
        </div>
        <div>
          <Eticheta text="Descriere scurta" />
          <textarea rows={3} value={cv.descriere} onChange={(e) => actualizeaza("descriere", e.target.value)} />
        </div>
        <div>
          <Eticheta text="Scrisoare de intentie" />
          <textarea
            rows={6}
            value={cv.scrisoare_intentie}
            onChange={(e) => actualizeaza("scrisoare_intentie", e.target.value)}
          />
        </div>
      </GlassPanel>

      {/* --- Experienta --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.1}>
        <RepeatableGroup
          titlu="Experienta profesionala"
          elemente={cv.experienta}
          getId={(e) => e.id}
          onAdauga={adaugaExperienta}
          onSterge={(id) => actualizeaza("experienta", cv.experienta.filter((e) => e.id !== id))}
          textButonAdauga="+ Adauga experienta"
          gol="Nicio experienta adaugata."
          renderItem={(item) => (
            <div className="ogw-grid ogw-grid--2">
              <input
                placeholder="Companie"
                value={item.companie}
                onChange={(e) => actualizeazaExperienta(item.id, { companie: e.target.value })}
              />
              <input
                placeholder="Functie"
                value={item.functie}
                onChange={(e) => actualizeazaExperienta(item.id, { functie: e.target.value })}
              />
              <input
                type="month"
                value={item.data_inceput}
                onChange={(e) => actualizeazaExperienta(item.id, { data_inceput: e.target.value })}
              />
              <input
                type="month"
                value={item.data_sfarsit ?? ""}
                placeholder="Prezent"
                onChange={(e) => actualizeazaExperienta(item.id, { data_sfarsit: e.target.value || null })}
              />
              <textarea
                className="ogw-grid__full"
                rows={2}
                placeholder="Descriere responsabilitati"
                value={item.descriere}
                onChange={(e) => actualizeazaExperienta(item.id, { descriere: e.target.value })}
              />
            </div>
          )}
        />
      </GlassPanel>

      {/* --- Educatie --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.15}>
        <RepeatableGroup
          titlu="Educatie"
          elemente={cv.educatie}
          getId={(e) => e.id}
          onAdauga={adaugaEducatie}
          onSterge={(id) => actualizeaza("educatie", cv.educatie.filter((e) => e.id !== id))}
          textButonAdauga="+ Adauga educatie"
          gol="Nicio institutie adaugata."
          renderItem={(item) => (
            <div className="ogw-grid ogw-grid--2">
              <input
                placeholder="Institutie"
                value={item.institutie}
                onChange={(e) => actualizeazaEducatie(item.id, { institutie: e.target.value })}
              />
              <input
                placeholder="Specializare"
                value={item.specializare}
                onChange={(e) => actualizeazaEducatie(item.id, { specializare: e.target.value })}
              />
              <select
                value={item.nivel}
                onChange={(e) => actualizeazaEducatie(item.id, { nivel: e.target.value as EducatieItem["nivel"] })}
              >
                <option value="liceu">Liceu</option>
                <option value="facultate">Facultate</option>
                <option value="master">Master</option>
                <option value="doctorat">Doctorat</option>
                <option value="curs">Curs</option>
                <option value="certificare">Certificare</option>
              </select>
              <input
                type="month"
                value={item.data_inceput}
                onChange={(e) => actualizeazaEducatie(item.id, { data_inceput: e.target.value })}
              />
            </div>
          )}
        />
      </GlassPanel>

      {/* --- Limbi --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.2}>
        <RepeatableGroup
          titlu="Limbi straine"
          elemente={cv.limbi}
          getId={(l) => l.id}
          onAdauga={adaugaLimba}
          onSterge={(id) => actualizeaza("limbi", cv.limbi.filter((l) => l.id !== id))}
          textButonAdauga="+ Adauga limba"
          gol="Nicio limba adaugata."
          renderItem={(item) => (
            <div className="ogw-grid ogw-grid--2">
              <input
                placeholder="Limba"
                value={item.limba}
                onChange={(e) => actualizeazaLimba(item.id, { limba: e.target.value })}
              />
              <select
                value={item.nivel}
                onChange={(e) => actualizeazaLimba(item.id, { nivel: e.target.value as LimbaItem["nivel"] })}
              >
                {["A1", "A2", "B1", "B2", "C1", "C2", "nativ"].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
      </GlassPanel>

      {/* --- Skills --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.25}>
        <h2>Skiluri</h2>
        <div className="ogw-tag-input">
          <input
            value={skillNou}
            onChange={(e) => setSkillNou(e.target.value)}
            placeholder="ex: React, Photoshop, Vanzari..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adaugaSkill())}
          />
          <button type="button" className="ogw-btn ogw-btn--ghost" onClick={adaugaSkill}>
            Adauga
          </button>
        </div>
        <div className="ogw-tags">
          {cv.skills.map((s) => (
            <span key={s} className="ogw-tag">
              {s}
              <button type="button" onClick={() => stergeSkill(s)}>✕</button>
            </span>
          ))}
        </div>
      </GlassPanel>

      {/* --- Portofoliu --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.3}>
        <RepeatableGroup
          titlu="Portofoliu"
          elemente={cv.portofoliu}
          getId={(p) => p.id}
          onAdauga={adaugaPortofoliu}
          onSterge={(id) => actualizeaza("portofoliu", cv.portofoliu.filter((p) => p.id !== id))}
          textButonAdauga="+ Adauga proiect"
          gol="Niciun proiect adaugat."
          renderItem={(item) => (
            <div className="ogw-grid ogw-grid--2">
              <input
                placeholder="Titlu proiect"
                value={item.titlu}
                onChange={(e) => actualizeazaPortofoliu(item.id, { titlu: e.target.value })}
              />
              <input
                placeholder="Link (URL)"
                value={item.url}
                onChange={(e) => actualizeazaPortofoliu(item.id, { url: e.target.value })}
              />
            </div>
          )}
        />
      </GlassPanel>

      {/* --- Documente --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.35}>
        <h2>Diplome & certificate</h2>
        <FileUploadField
          eticheta="Incarca diploma / certificat"
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
        <ul className="ogw-doc-list">
          {cv.documente.map((doc) => (
            <li key={doc.id}>
              <a href={doc.url} target="_blank" rel="noreferrer">{doc.nume_fisier}</a>
              <button
                type="button"
                onClick={() => actualizeaza("documente", cv.documente.filter((d) => d.id !== doc.id))}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </GlassPanel>

      {/* --- Social links --- */}
      <GlassPanel className="ogw-editor__sectiune" intarziereReveal={0.4}>
        <h2>Retele sociale</h2>
        <div className="ogw-grid ogw-grid--2">
          {(["facebook", "instagram", "linkedin", "tiktok"] as const).map((retea) => (
            <div key={retea}>
              <Eticheta text={retea[0].toUpperCase() + retea.slice(1)} />
              <input
                placeholder="https://..."
                value={cv.social_links[retea] ?? ""}
                onChange={(e) =>
                  actualizeaza("social_links", { ...cv.social_links, [retea]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* --- Status + actiuni --- */}
      <GlassPanel className="ogw-editor__sectiune ogw-editor__actiuni" intarziereReveal={0.45}>
        <div>
          <Eticheta text="Status CV" />
          <select value={cv.status} onChange={(e) => actualizeaza("status", e.target.value as CV["status"])}>
            <option value="ciorna">Ciorna</option>
            <option value="in_lucru">In lucru</option>
            <option value="complet">Complet</option>
            <option value="publicat">Publicat</option>
          </select>
        </div>

        <div className="ogw-editor__butoane">
          {cv.id && (
            <button type="button" className="ogw-btn ogw-btn--danger" onClick={sterge}>
              Sterge CV
            </button>
          )}
          <motion.button
            type="button"
            className="ogw-btn ogw-btn--primar"
            onClick={salveaza}
            disabled={seSalveaza}
            whileTap={{ scale: 0.97 }}
          >
            {seSalveaza ? "Se salveaza..." : "Salveaza CV"}
          </motion.button>
        </div>

        {mesaj && (
          <p className={mesaj.tip === "ok" ? "ogw-mesaj ogw-mesaj--ok" : "ogw-mesaj ogw-mesaj--eroare"}>
            {mesaj.text}
          </p>
        )}
      </GlassPanel>
    </div>
  );
}