"use client";

// components/admin/FileUploadField.tsx
// Camp de incarcare fisiere (poza de profil / diplome / certificate) catre Supabase Storage.

import { useRef, useState, useTransition } from "react";
import { incarcaFisier, STORAGE_BUCKETS } from "@/lib/supabase/client";

interface FileUploadFieldProps {
  eticheta: string;
  adminId: string;
  bucket: keyof typeof STORAGE_BUCKETS;
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
          const url = await incarcaFisier(bucket, adminId, fisier);
          onIncarcat(url, fisier.name);
        }
      } catch (err) {
        setEroare(err instanceof Error ? err.message : "Încărcarea a eșuat.");
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
      
      {/* Folosim un div interactiv în loc de label imbricat pentru a preveni dublarea evenimentelor */}
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
        <p className="ogw-field__eroare" role="alert">
          {eroare}
        </p>
      )}
    </div>
  );
}