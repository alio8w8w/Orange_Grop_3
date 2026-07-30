// components/home/landing/projects-section.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function ProjectsSection() {
  const t = useTranslations('Projects')
  const [allProjects, setAllProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('cvs').select('*')
      if (error) {
        console.error('Eroare la preluarea proiectelor:', error.message)
      } else if (data) {
        // Extragem portofoliul din fiecare CV salvat în baza de date
        const extrase = data.flatMap((cv) => {
          const portofoliuList = cv.portofoliu || []
          return portofoliuList.map((p: any) => ({
            ...p,
            autorNume: `${cv.nume || ''} ${cv.prenume || ''}`.trim(),
          }))
        })
        setAllProjects(extrase)
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-24 lg:py-28 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Titlul secțiunii */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
            {t('subtitle')}
          </p>
          <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-brand-white sm:text-3xl lg:text-4xl">
            {t('heading')}
          </h2>
        </div>

        {/* Stare de încărcare / afișare proiecte */}
        {loading ? (
          <div className="text-center text-brand-white/60 text-sm sm:text-base">
            Se încarcă...
          </div>
        ) : !allProjects || allProjects.length === 0 ? (
          <p className="text-center text-brand-white/60 text-sm sm:text-base">
            {t('noProjects')}
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project, index) => {
              const esteWebsite = project.tip_proiect === 'website' || (!project.tip_proiect && project.url);
              const areImagini = project.imagini_url && project.imagini_url.length > 0;

              // Gestionăm corect URL-ul în caz că lipsește https://
              const urlValid = project.url
                ? project.url.startsWith('http') ? project.url : `https://${project.url}`
                : '';

              return (
                <div
                  key={project.id || index}
                  className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-6 backdrop-blur-sm flex flex-col justify-between transition-transform duration-300 hover:border-brand-orange/40 hover:-translate-y-1"
                >
                  <div>
                    {/* Numele proiectului */}
                    <h3 className="font-display text-lg font-bold uppercase text-brand-orange tracking-wide">
                      {project.titlu || 'Proiect fără titlu'}
                    </h3>

                    {project.autorNume && (
                      <span className="block text-xs text-brand-white/40 mt-1">
                        Autor: {project.autorNume}
                      </span>
                    )}

                    {/* Descriere */}
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-white/70">
                      {project.descriere}
                    </p>
                  </div>

                  {/* Zona de acțiune: Link Website sau Galerie de poze */}
                  <div className="mt-6 pt-4 border-t border-brand-white/10">
                    
                    {/* Varianta 1: Proiect de tip Website (Clickabil către link) */}
                    {esteWebsite && urlValid && (
                      <a
                        href={urlValid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-white"
                      >
                        {t('viewWebsite')} →
                      </a>
                    )}

                    {/* Varianta 2: Proiect de tip Galerie (Afișează pozele din Supabase Storage) */}
                    {areImagini && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {project.imagini_url.map((imgUrl: string, imgIdx: number) => (
                          <a
                            key={imgIdx}
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block overflow-hidden rounded-lg border border-brand-white/10"
                          >
                            <img
                              src={imgUrl}
                              alt={`${project.titlu} - ${imgIdx + 1}`}
                              className="h-24 w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}