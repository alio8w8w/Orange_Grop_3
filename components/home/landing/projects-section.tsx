'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface FallingOrange {
  id: number
  startX: number
  startY: number
  xOffset: number
  size: number
  rotation: number
  duration: number
}

export function ProjectsSection() {
  const t = useTranslations('Projects')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  
  const [fallingOranges, setFallingOranges] = useState<FallingOrange[]>([])
  const spawnRef = useRef<HTMLDivElement>(null)

  // Funcție care declanșază căderea portocalelor sub formă de piramidă de sub titlu
  const triggerOranges = () => {
    if (!spawnRef.current) return
    const rect = spawnRef.current.getBoundingClientRect()
    const startX = rect.left + rect.width / 2
    const startY = rect.top + window.scrollY

    const newOranges: FallingOrange[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      startX,
      startY,
      xOffset: (Math.random() - 0.5) * 550, // Evantaj / piramidă
      size: Math.floor(Math.random() * 40 + 95), // Portocale mari și vizibile
      rotation: Math.random() * 360,
      duration: Math.random() * 0.7 + 1.6,
    }))

    setFallingOranges((prev) => [...prev, ...newOranges])

    setTimeout(() => {
      setFallingOranges((prev) => prev.filter((o) => !newOranges.includes(o)))
    }, 2400)
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase.from('cvs').select('portofoliu')
        if (error) {
          setFetchError(error.message)
        } else {
          let extractedProjects: any[] = []
          data?.forEach((row: any) => {
            if (row.portofoliu) {
              let portofoliuData = row.portofoliu
              if (typeof portofoliuData === 'string') {
                try { portofoliuData = JSON.parse(portofoliuData) } catch (e) {}
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
    <section id="projects" className="relative py-16 sm:py-24 lg:py-28 bg-transparent overflow-visible">
      
      {/* 🍊 STRATUL DE CĂDERE (PLASAT STRICT ÎN SPATELE TEXTULUI - z-0) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        <AnimatePresence>
          {fallingOranges.map((orange) => (
            <motion.img
              key={orange.id}
              src="/images/portocala1.png"
              alt="Portocală"
              initial={{ 
                position: 'absolute',
                left: orange.startX,
                top: 40,
                x: '-50%',
                y: 0,
                scale: 0.2, 
                opacity: 0, 
                rotate: 0 
              }}
              animate={{
                x: `calc(-50% + ${orange.xOffset}px)`,
                y: window.innerHeight * 1.2, // Cad în jos spre zona de contact
                scale: 1,
                opacity: [0, 1, 1, 0.95],
                rotate: orange.rotation + 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: orange.duration,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                width: `${orange.size}px`,
                height: `${orange.size}px`,
                objectFit: 'contain',
                filter: 'brightness(0.85) contrast(1.05) saturate(1.10) drop-shadow(0 12px 20px rgba(0,0,0,0.6))',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        
        {/* Titlu și punct de lansare pentru portocale */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
            {t('subtitle')}
          </p>
          <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-brand-white sm:text-3xl lg:text-4xl">
            {t('heading')}
          </h2>
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
                  onMouseEnter={triggerOranges}
                  onClick={triggerOranges}
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