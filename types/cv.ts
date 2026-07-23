// types/cv.ts
// Toate tipurile folosite in panelul de administrare Orange_Group_3

export type AdminRole = "superadmin" | "admin";

export interface AdminProfile {
  id: string; // auth.users.id din Supabase
  email: string;
  nume_afisat: string;
  role: AdminRole;
  avatar_url?: string | null;
  created_at: string;
}

export interface ExperientaItem {
  id: string;
  companie: string;
  functie: string;
  locatie?: string;
  data_inceput: string; // YYYY-MM
  data_sfarsit?: string | null; // null = "prezent"
  descriere?: string;
}

export interface EducatieItem {
  id: string;
  institutie: string;
  specializare: string;
  nivel: "liceu" | "facultate" | "master" | "doctorat" | "curs" | "certificare";
  data_inceput: string;
  data_sfarsit?: string | null;
  descriere?: string;
}

export interface LimbaItem {
  id: string;
  limba: string;
  nivel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "nativ";
}

export interface PortofoliuItem {
  id: string;
  titlu: string;
  url: string;
  descriere?: string;
  imagine_url?: string | null;
}

export interface DocumentAtasat {
  id: string;
  nume_fisier: string;
  url: string;
  tip: "diploma" | "certificat";
  data_incarcare: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
}

export type CVStatus = "ciorna" | "in_lucru" | "complet" | "publicat";

// Campurile obligatorii vs optionale sunt marcate explicit ca sa poata fi
// validate atat pe formular cat si la nivel de baza de date (NOT NULL).
export interface CV {
  id: string;
  admin_id: string; // cui apartine CV-ul (1:1 cu profilul de admin)

  // --- Date personale (obligatorii) ---
  nume: string;
  prenume: string;
  telefon: string;
  email: string;
  localitate: string;

  // --- Date personale (optionale) ---
  poza_url?: string | null;
  data_nasterii?: string | null;
  permis_conducere?: string[] | null; // ex: ["B", "BE"]

  // --- Continut narativ (optional, dar recomandat) ---
  biografie?: string;
  descriere?: string;
  scrisoare_intentie?: string;

  // --- Liste (pot fi goale) ---
  experienta: ExperientaItem[];
  educatie: EducatieItem[];
  limbi: LimbaItem[];
  skills: string[];
  portofoliu: PortofoliuItem[];
  documente: DocumentAtasat[];

  // --- Retele sociale (optionale) ---
  social_links: SocialLinks;

  status: CVStatus;
  created_at: string;
  updated_at: string;
}

// Config declarativ pentru campuri: folosit ca sa marcam vizual
// obligatoriu / optional in formular fara sa dublam logica peste tot.
export const CAMPURI_OBLIGATORII: (keyof CV)[] = [
  "nume",
  "prenume",
  "telefon",
  "email",
  "localitate",
];