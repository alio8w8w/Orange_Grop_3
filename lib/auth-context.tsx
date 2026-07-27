"use client";

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
      console.log("[DEBUG 1] Încep verificarea sesiunii în AuthProvider...");

      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[EROARE ❌] Nu am putut obține sesiunea Supabase:", sessionError.message);
      }

      if (!session) {
        console.warn("[STOP ⛔] Sesiunea este null (Utilizatorul NU este logat în Supabase Auth).");
        setProfil(null);
        setSeIncarca(false);
        return;
      }

      console.log("[SUCCES ✅] Sesiune găsită pentru user ID:", session.user.id, "Email:", session.user.email);

      // Căutăm profilul în admin_profiles
      console.log("[DEBUG 2] Caut în tabela 'admin_profiles' după id:", session.user.id);
      
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("admin_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("[EROARE ❌] Supabase a dat eroare la interogarea 'admin_profiles':", error.message, error.details, error.hint);
        setProfil(null);
      } else if (!data) {
        console.error("[STOP ⛔] Sesiunea există, DAR userul cu acest ID NU a fost găsit în tabela 'admin_profiles'!");
      } else {
        console.log("[SUCCES 🚀] Profil găsit în 'admin_profiles':", data);
        setProfil(data as AdminProfile);
      }

      setSeIncarca(false);
    }

    incarcaProfil();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[EVENT 🔄 Auth State Schimbat]:", event, session?.user?.email);
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
  if (!ctx) throw new Error("useAuth trebuie folosit în interiorul AuthProvider");
  return ctx;
}