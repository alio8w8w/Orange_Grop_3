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
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Stare pentru Lightbox (fereastra plutitoare cu poze mărite)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase.from('cvs').select('*')
        if (error) {
          console.error('Eroare Supabase:', error.message)
          setFetchError(error.message)
        } else {
          console.log('Date primite din Supabase:', data)
          setProjects(data || [])
        }
      } catch (err: any) {
        console.error('Eroare neașteptată:', err)
        setFetchError(err.message)
      } finally {
        setLoading(false)
      }
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

        {/* Mesaje de eroare / încărcare / gol */}
        {loading ? (
          <div className="text-center text-brand-white/60 text-sm sm:text-base">
            Se încarcă proiectele...
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-400 text-sm sm:text-base bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            Eroare la conexiunea cu baza de date: {fetchError}. Verifică politicile RLS din Supabase.
          </div>
        ) : !projects || projects.length === 0 ? (
          <p className="text-center text-brand-white/60 text-sm sm:text-base">
            {t('noProjects')} (Tabelul cvs este gol sau lipsesc permisiunile RLS)
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => {
              // Extragere flexibilă a câmpurilor indiferent de denumirea din baza de date
              const projectTitle = project.title || project.nume || project.name || project.project_name
              const projectDesc = project.description || project.descriere || project.details
              const projectAuthor = project.author || project.autor || project.creator || project.user_name
              const projectLink = project.link || project.url || project.website
              
              // Gestionare flexibilă pentru imagini (array, string JSON sau text cu virgule)
              let rawImages = project.images || project.poze || project.photos || project.image || []
              if (typeof rawImages === 'string') {
                try {
                  rawImages = JSON.parse(rawImages)
                } catch {
                  rawImages = rawImages.split(',').map((s: string) => s.trim()).filter(Boolean)
                }
              }
              const projectImages = Array.isArray(rawImages) ? rawImages : [rawImages].filter(Boolean)

              const hasLink = Boolean(projectLink)
              const hasImages = projectImages.length > 0

              return (
                <div
                  key={project.id || idx}
                  className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-6 backdrop-blur-sm flex flex-col justify-between transition-transform duration-300 hover:border-brand-orange/40 hover:-translate-y-1"
                >
                  <div>
                    {/* Autorul proiectului */}
                    {projectAuthor && (
                      <span className="inline-block mb-2 text-xs font-semibold tracking-wider uppercase text-brand-orange/80">
                        Autor: {projectAuthor}
                      </span>
                    )}

                    {/* Numele proiectului */}
                    <h3 className="font-display text-lg font-bold uppercase text-brand-orange tracking-wide">
                      {projectTitle || 'Proiect fără titlu'}
                    </h3>

                    {/* Descriere */}
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-white/70">
                      {projectDesc || 'Fără descriere disponibilă.'}
                    </p>
                  </div>

                  {/* Zona de acțiune: Link website sau Galerie de poze */}
                  <div className="mt-6 pt-4 border-t border-brand-white/10">
                    
                    {/* Varianta 1: Link către website */}
                    {hasLink && (
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-white"
                      >
                        {t('viewWebsite')} →
                      </a>
                    )}

                    {/* Varianta 2: Portofoliu cu poze (Click deschide fereastra plutitoare) */}
                    {hasImages && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {projectImages.map((imgUrl: string, imgIndex: number) => (
                          <img
                            key={imgIndex}
                            src={imgUrl}
                            alt={`${projectTitle || 'Proiect'} - ${imgIndex + 1}`}
                            onClick={() => setActiveImage(imgUrl)}
                            className="h-24 w-full object-cover rounded-lg border border-brand-white/10 cursor-pointer transition-transform duration-300 hover:scale-105 hover:border-brand-orange"
                            title="Click pentru a mări poza"
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

      {/* Fereastra Plutitoare (Lightbox) pentru mărirea pozelor */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 text-white text-xl font-bold bg-brand-orange/80 hover:bg-brand-orange px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              ✕ Închide
            </button>
            <img
              src={activeImage}
              alt="Imagine mărită"
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-brand-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  )
}