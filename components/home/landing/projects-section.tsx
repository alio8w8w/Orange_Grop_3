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
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('cvs').select('*')
      if (error) {
        console.error('Eroare la preluarea proiectelor:', error.message)
      } else {
        setProjects(data || [])
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
        ) : !projects || projects.length === 0 ? (
          <p className="text-center text-brand-white/60 text-sm sm:text-base">
            {t('noProjects')}
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const hasLink = Boolean(project.link)
              const hasImages = Boolean(project.images && project.images.length > 0)

              return (
                <div
                  key={project.id}
                  className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-6 backdrop-blur-sm flex flex-col justify-between transition-transform duration-300 hover:border-brand-orange/40 hover:-translate-y-1"
                >
                  <div>
                    {/* Numele proiectului */}
                    <h3 className="font-display text-lg font-bold uppercase text-brand-orange tracking-wide">
                      {project.title}
                    </h3>

                    {/* Descriere */}
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-white/70">
                      {project.description}
                    </p>
                  </div>

                  {/* Cele 2 variante: Link website sau Galerie de poze */}
                  <div className="mt-6 pt-4 border-t border-brand-white/10">
                    
                    {/* Varianta 1: Link către website */}
                    {hasLink && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-white"
                      >
                        {t('viewWebsite')} →
                      </a>
                    )}

                    {/* Varianta 2: Portofoliu cu poze */}
                    {hasImages && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {project.images.map((imgUrl: string, index: number) => (
                          <img
                            key={index}
                            src={imgUrl}
                            alt={`${project.title} - ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg border border-brand-white/10 transition-transform duration-300 hover:scale-105"
                          />
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