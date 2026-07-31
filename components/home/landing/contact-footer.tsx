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
  const [eroare, setEroare] = useState(false);

  useEffect(() => {
    async function incarcaSpecialisti() {
      try {
        // Aici am eliminat comentariul care bloca Supabase-ul
        const { data, error } = await supabase
          .from("cvs")
          .select(`
            id,
            admin_id,
            admin_profiles (
              nume_afisat,
              poza_url,
              email
            ),
            functie
          `)
          .limit(4);

        if (error) throw error;

        // Mapăm datele pentru a fi ușor de folosit în UI
        const dateFormatate = data.map((item: any) => ({
          id: item.id,
          nume: item.admin_profiles?.nume_afisat || "Specialist Necunoscut",
          functie: item.functie || "Membru Echipa", 
          poza_url: item.admin_profiles?.poza_url || "/images/default-avatar.png",
          email: item.admin_profiles?.email || "hello@orangegroup3.com",
        }));

        setSpecialisti(dateFormatate);
      } catch (err) {
        console.error("Eroare la încărcarea specialiștilor:", err);
        setEroare(true);
      } finally {
        setSeIncarca(false);
      }
    }

    incarcaSpecialisti();
  }, []);

  return (
    <section className="ogw-specialists-section">
      <div className="ogw-specialists-header">
        <h2>{t("titluSeciune")}</h2>
        <p>{t("descriere")}</p>
      </div>

      {seIncarca ? (
        <p className="ogw-mesaj-stare">{t("seIncarca")}</p>
      ) : eroare ? (
        <p className="ogw-mesaj-stare eroare">{t("eroare")}</p>
      ) : (
        <div className="ogw-specialists-grid">
          {specialisti.map((spec, index) => (
            <motion.a
              key={spec.id}
              href={`mailto:${spec.email}`}
              className="ogw-specialist-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              title={`Trimite un email lui ${spec.nume}`}
            >
              <div className="ogw-avatar-container">
                <img 
                  src={spec.poza_url} 
                  alt={`Poza ${spec.nume}`} 
                  className="ogw-avatar-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + spec.nume + '&background=ff7900&color=fff';
                  }}
                />
                <div className="ogw-avatar-glow"></div>
              </div>
              
              <h3 className="ogw-specialist-nume">{spec.nume}</h3>
              <p className="ogw-specialist-functie">{spec.functie}</p>
            </motion.a>
          ))}
        </div>
      )}

      {/* Stilurile adaptate inclusiv pentru varianta de mobil */}
      <style jsx>{`
        .ogw-specialists-section {
          padding: 4rem 1.5rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .ogw-specialists-header {
          margin-bottom: 3rem;
        }

        .ogw-specialists-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .ogw-specialists-header p {
          color: #a0a0a0;
          font-size: 1.1rem;
        }

        .ogw-mesaj-stare {
          color: white;
          opacity: 0.7;
        }
        .ogw-mesaj-stare.eroare {
          color: #ff4d4d;
        }

        .ogw-specialists-grid {
          display: grid;
          /* Pe desktop apar toate 4 pe un rând, pe mobil se așează câte 2 sau 1 în funcție de ecran */
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2.5rem;
          justify-items: center;
        }

        .ogw-specialist-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
          group: hover;
        }

        .ogw-avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 1.25rem;
          border-radius: 50%;
        }

        .ogw-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          position: relative;
          z-index: 2;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 3px solid transparent;
          background-color: #2a2a2a;
        }

        /* Efectul de glowing ascuns inițial */
        .ogw-avatar-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: var(--primary, #ff7900);
          z-index: 1;
          opacity: 0;
          filter: blur(15px);
          transition: all 0.4s ease;
          transform: scale(0.9);
        }

        /* HOVER EFFECTS */
        .ogw-specialist-card:hover .ogw-avatar-img {
          transform: scale(1.1);
          border-color: var(--primary, #ff7900);
        }

        .ogw-specialist-card:hover .ogw-avatar-glow {
          opacity: 0.7;
          transform: scale(1.15);
        }

        .ogw-specialist-nume {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          transition: color 0.3s ease;
        }

        .ogw-specialist-functie {
          color: var(--primary, #ff7900);
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.9;
        }

        .ogw-specialist-card:hover .ogw-specialist-nume {
          color: var(--primary, #ff7900);
        }

        /* RESPONSIVITATE PENTRU MOBIL */
        @media (max-width: 768px) {
          .ogw-specialists-section {
            padding: 2rem 1rem;
          }
          
          .ogw-specialists-grid {
            /* Pe telefoane mici forțăm 2 coloane pentru ca avatarele să stea frumos */
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .ogw-avatar-container {
            width: 100px;
            height: 100px;
          }

          .ogw-specialist-nume {
            font-size: 1.1rem;
          }

          .ogw-specialist-functie {
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 480px) {
          .ogw-specialists-grid {
             /* Pe ecrane foarte înguste lăsăm 1 element pe rând dacă e nevoie, deși 2 de obicei arată bine pentru avatare */
             grid-template-columns: 1fr;
          }
          .ogw-avatar-container {
            width: 130px;
            height: 130px;
          }
        }
      `}</style>
    </section>
  );
}