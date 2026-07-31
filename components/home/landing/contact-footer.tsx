"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useTranslations } from "next-intl"; 
import { motion } from "framer-motion";

interface Specialist {
  id: string;
  nume: string;
  functie: string;
  poza_url: string;
  email: string;
}

export default function ContactSpecialists() {
  const t = useTranslations("Contact");
  const [specialisti, setSpecialisti] = useState<Specialist[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    async function incarcaSpecialisti() {
      try {
        const { data } = await supabase
          .from("cvs")
          .select(`
            id,
            admin_profiles (nume_afisat, poza_url, email),
            functie
          `)
          .limit(4);

        if (data) {
          setSpecialisti(data.map((item: any) => ({
            id: item.id,
            nume: item.admin_profiles?.nume_afisat || "Specialist",
            functie: item.functie || "Membru Echipă", 
            poza_url: item.admin_profiles?.poza_url || "/images/default-avatar.png",
            email: item.admin_profiles?.email || "hello@orangegroup3.com",
          })));
        }
      } finally {
        setSeIncarca(false);
      }
    }
    incarcaSpecialisti();
  }, []);

  return (
    <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto bg-transparent">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Header / Text */}
        <div className="max-w-xl text-left">
          <span className="text-xs font-bold tracking-widest text-brand-orange uppercase">
            ORANGE GROUP 3
          </span>
          <h2 className="text-4xl font-black uppercase text-white mt-2 mb-4">
            {t("titluSeciune")}
          </h2>
          <p className="text-white/70 text-lg">
            {t("descriere")}
          </p>
        </div>

        {/* Grid Specialiști */}
        <div className="w-full lg:w-auto">
          {seIncarca ? (
            <p className="text-white/50 text-center">{t("seIncarca")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {specialisti.map((spec, index) => (
                <motion.a
                  key={spec.id}
                  href={`mailto:${spec.email}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center group text-center"
                >
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 mb-3 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-brand-orange transition-all duration-300 shadow-2xl">
                    <img 
                      src={spec.poza_url} 
                      alt={spec.nume} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-brand-orange transition-colors">
                    {spec.nume}
                  </h3>
                  <p className="text-brand-orange/90 text-sm">{spec.functie}</p>
                </motion.a>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}