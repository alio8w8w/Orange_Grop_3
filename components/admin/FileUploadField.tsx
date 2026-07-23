"use client";

// components/admin/FileUploadField.tsx
// Camp de incarcare fisiere (poza de profil / diplome / certificate) catre Supabase Storage.

import { useRef, useState } from "react";
import { incarcaFisier, STORAGE_BUCKETS } from "@/lib/supabase";

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
  const [seIncarca, setSeIncarca] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  async function laSchimbare(e: React.ChangeEvent<HTMLInputElement>) {
    const fisiere = e.target.files;
    if (!fisiere || fisiere.length === 0) return;

    setSeIncarca(true);
    setEroare(null);

    try {
      for (const fisier of Array.from(fisiere)) {
        if (fisier.size > 10 * 1024 * 1024) {
          throw new Error(`"${fisier.name}" depaseste 10MB.`);
        }
        const url = await incarcaFisier(bucket, adminId, fisier);
        onIncarcat(url, fisier.name);
      }
    } catch (err) {
      setEroare(err instanceof Error ? err.message : "Incarcarea a esuat.");
    } finally {
      setSeIncarca(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="ogw-upload">
      <label className="ogw-field__label">{eticheta}</label>
      <label className="ogw-upload__zona">
        <input
          ref={inputRef}
          type="file"
          accept={tipuriAcceptate}
          multiple={acceptaMultiplu}
          onChange={laSchimbare}
          className="ogw-upload__input"
        />
        <span>{seIncarca ? "Se incarca..." : "Alege fisier sau trage aici"}</span>
      </label>
      {eroare && <p className="ogw-field__eroare">{eroare}</p>}
    </div>
  );
}