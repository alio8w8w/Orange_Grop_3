'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ProjectsSectionProps {
  onCardHover?: (coords?: { x: number; y: number }) => void
}

export function ProjectsSection({ onCardHover }: ProjectsSectionProps) {
  const t = useTranslations('Projects')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  
  // Referință pentru punctul exact de sub titlu de unde cad portocalele
  const spawnRef = useRef<HTMLDivElement>(null)

  const handleTrigger = () => {
    if (spawnRef.current && onCardHover) {
      const rect = spawnRef.current.getBoundingClientRect()
      // Trimitem coordonatele X și Y absolute pe ecran de unde va cădea portocala
      onCardHover({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY,
      })
    } else if (onCardHover) {
      onCardHover()
    }
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('portofoliu')

        if (error) {
          setFetchError(error.message)
        } else {
          let extractedProjects: any[] = []
          data?.forEach((row: any) => {
            if (row.portofoliu) {
              let portofoliuData = row.portofoliu
              if (typeof portofoliuData === 'string') {
                try {
                  portofoliuData = JSON.parse(portofoliuData)
                } catch (e) {}
              }
              if (Array.isArray(portofoliuData)) {
                extractedProjects.push(...portofoliuData)
              } else if (typeof portofoliuData === 'object' && portofoliuData !== null) {
                extractedProjects.push(portofoliuData)
              }
            }
          })
          setProjects(extractedProjects)
        }
      } catch (err: any) {
        setFetchError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-24 lg:py-28 bg-transparent overflow-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glowPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        .animate-glow-1 { animation: glowPulse 6s ease-in-out infinite; }
        .animate-glow-2 { animation: glowPulse 8s ease-in-out infinite 2s; }
        .animate-glow-3 { animation: glowPulse 7s ease-in-out infinite 4s; }
      `}} />

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-brand-orange/20 rounded-full blur-[100px] animate-glow-1" />
        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-16 w-80 h-80 sm:w-[420px] sm:h-[420px] bg-brand-orange/15 rounded-full blur-[120px] animate-glow-2" />
        <div className="absolute top-[45%] right-10 sm:right-24 w-72 h-72 sm:w-96 sm:h-96 bg-brand-orange/20 rounded-full blur-[110px] animate-glow-3" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        
        {/* Subtitlu și Titlu */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
            {t('subtitle')}
          </p>
          <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-brand-white sm:text-3xl lg:text-4xl">
            {t('heading')}
          </h2>
          {/* Punct de referință (sub titlu, de unde pornește piramida de portocale) */}
          <div ref={spawnRef} className="w-full h-1 mt-4" />
        </div>

        {loading ? (
          <div className="text-center text-brand-white/60 text-sm">Se încarcă proiectele...</div>
        ) : fetchError ? (
          <div className="text-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            Eroare: {fetchError}
          </div>
        ) : !projects || projects.length === 0 ? (
          <p className="text-center text-brand-white/60 text-sm">{t('noProjects')}</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => {
              const projectTitle = project.titlu || project.title || 'Proiect'
              const projectDesc = project.descriere || project.description || 'Fără descriere.'
              let rawUrl = project.url || project.link || ''
              const projectLink = rawUrl && !rawUrl.startsWith('http') ? `https://${rawUrl}` : rawUrl
              const imageUrl = project.imagine_url || project.image || project.poza

              return (
                <motion.div
                  key={project.id || idx}
                  onMouseEnter={handleTrigger}
                  onClick={handleTrigger}
                  whileHover={{ 
                    rotate: [0, -2, 2, -1, 1, 0],
                    transition: { duration: 0.4 } 
                  }}
                  className="rounded-xl border border-brand-white/10 bg-brand-white/[0.04] p-6 backdrop-blur-md flex flex-col justify-between cursor-pointer shadow-xl transition-all hover:border-brand-orange/60 hover:bg-brand-white/[0.06]"
                  style={{ transformOrigin: 'top center' }}
                >
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase text-brand-orange tracking-wide">
                      {projectTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-white/70">
                      {projectDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-white/10 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={projectTitle}
                        onClick={() => setActiveImage(imageUrl)}
                        className="h-32 w-full object-cover rounded-lg border border-brand-white/10 cursor-pointer transition-transform duration-300 hover:scale-105 hover:border-brand-orange"
                      />
                    )}
                    {projectLink && (
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-white"
                      >
                        {t('viewWebsite')} →
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setActiveImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveImage(null)} className="absolute -top-10 right-0 text-white font-bold bg-brand-orange px-3 py-1 rounded-full">✕</button>
            <img src={activeImage} alt="Mărită" className="max-w-full max-h-[85vh] object-contain rounded-lg border border-brand-white/20 shadow-2xl" />
          </div>
        </div>
      )}
    </section>
  )
}