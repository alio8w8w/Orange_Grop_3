"use client";

// lib/auth-context.tsx
// Gestioneaza sesiunea celor 4 administratori.
// Restrictia "fiecare isi vede doar CV-ul lui" se aplica in DOUA locuri,
// niciodata doar in interfata:
//   1) Row Level Security in Supabase (vezi supabase/schema.sql) — bariera reala.
//   2) Aici, ca sa filtram si sa afisam corect in UI.
// Superadmin-ul are role = "superadmin" si o policy separata care ii da acces la tot.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "./supabase/client";
import type { AdminProfile } from "@/types/cv";

interface AuthContextValue {
  profil: AdminProfile | null;
  seIncarca: boolean;
  esteSuperadmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<AdminProfile | null>(null);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    async function incarcaProfil() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setProfil(null);
        setSeIncarca(false);
        return;
      }

      // Profilul (nume, rol) e citit din tabela "admin_profiles", populata manual
      // pentru cei 4 conturi admise — nu se pot inregistra alti useri din UI.
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("[auth] nu am putut incarca profilul:", error.message);
        setProfil(null);
      } else {
        setProfil(data as AdminProfile);
      }
      setSeIncarca(false);
    }

    incarcaProfil();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      incarcaProfil();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setProfil(null);
  }

  return (
    <AuthContext.Provider
      value={{
        profil,
        seIncarca,
        esteSuperadmin: profil?.role === "superadmin",
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth trebuie folosit in interiorul AuthProvider");
  return ctx;
}