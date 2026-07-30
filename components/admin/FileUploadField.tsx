"use client";

// components/admin/FileUploadField.tsx
// Camp de incarcare fisiere (poza de profil / diplome / certificate / portofoliu) catre Supabase Storage.

import { useRef, useState, useTransition } from "react";
import { incarcaFisier } from "@/lib/supabase/client";
import { supabase } from "@/lib/supabase/client";

interface FileUploadFieldProps {
  eticheta: string;
  adminId: string;
  bucket: "poze" | "documente" | "portofoliu" | (string & {}); 
  acceptaMultiplu?: boolean;
  tipuriAcceptate?: string; // ex: "image/*" sau ".pdf,.jpg,.png"
  onIncarcat: (url: string, numeFisier: string) => void;
}

export default function FileUploadField({
  eticheta,
  adminId,
  bucket,
  acceptaMultiplu = false,
  tipuriAcceptate = "image/*,.pdf",
  onIncarcat,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [seIncarca, startTransition] = useTransition();
  const [eroare, setEroare] = useState<string | null>(null);

  async function laSchimbare(e: React.ChangeEvent<HTMLInputElement>) {
    const fisiere = e.target.files;
    if (!fisiere || fisiere.length === 0) return;

    setEroare(null);

    startTransition(async () => {
      try {
        for (const fisier of Array.from(fisiere)) {
          if (fisier.size > 10 * 1024 * 1024) {
            throw new Error(`"${fisier.name}" depășește limita de 10MB.`);
          }

          console.log(`Încărcare fișier în bucket-ul: [${bucket}]...`);

          // 1. Încercăm să folosim funcția ta existentă
          let rezultatUrl = await incarcaFisier(bucket as any, adminId, fisier);

          // 2. Dacă funcția ta returnează doar calea relativă (fără https://), o convertim la URL public complet
          if (rezultatUrl && !rezultatUrl.startsWith("http")) {
            const { data: publicData } = supabase.storage
              .from(bucket)
              .getPublicUrl(rezultatUrl);
            
            rezultatUrl = publicData.publicUrl;
          }

          console.log("URL generat cu succes:", rezultatUrl);
          onIncarcat(rezultatUrl, fisier.name);
        }
      } catch (err: any) {
        console.error("Eroare detaliată upload:", err);
        setEroare(err?.message || "Încărcarea a eșuat.");
      } finally {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    });
  }

  return (
    <div className={`ogw-upload ${seIncarca ? "ogw-upload--loading" : ""}`}>
      <label className="ogw-field__label">{eticheta}</label>
      
      <div 
        className={`ogw-upload__zona ${seIncarca ? "is-disabled" : ""}`}
        onClick={() => !seIncarca && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={tipuriAcceptate}
          multiple={acceptaMultiplu}
          disabled={seIncarca}
          onChange={laSchimbare}
          className="ogw-upload__input"
        />
        <span>{seIncarca ? "Se încarcă fișierul..." : "Alege fișier sau trage aici"}</span>
      </div>

      {eroare && (
        <p className="ogw-field__eroare" role="alert" style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.25rem" }}>
          {eroare}
        </p>
      )}
    </div>
  );
}