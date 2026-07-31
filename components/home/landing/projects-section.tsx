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
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 })

  // Urmărim poziția mouse-ului pe ecran pentru ca portocalele să se ferească rapid
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Funcție care declanșază căderea portocalelor sub formă de piramidă de sub titlu
  const triggerOranges = () => {
    if (!spawnRef.current) return
    const rect = spawnRef.current.getBoundingClientRect()
    const startX = rect.left + rect.width / 2
    const startY = rect.top + window.scrollY

    const newOranges: FallingOrange[] = Array.from({ length: 9 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      startX,
      startY,
      xOffset: (Math.random() - 0.5) * 600, // Evantaj / piramidă
      size: Math.floor(Math.random() * 45 + 100), // Portocale mari și vizibile
      rotation: Math.random() * 360,
      duration: Math.random() * 0.8 + 1.8,
    }))

    setFallingOranges((prev) => [...prev, ...newOranges])

    setTimeout(() => {
      setFallingOranges((prev) => prev.filter((o) => !newOranges.includes(o)))
    }, 2800)
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
    <section id="projects" className="relative py-20 sm:py-28 lg:py-32 bg-transparent overflow-visible">
      
      {/* Stiluri CSS pentru animația de pulsare a bulelor de background */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glowPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .animate-glow-1 { animation: glowPulse 5s ease-in-out infinite; }
        .animate-glow-2 { animation: glowPulse 7s ease-in-out infinite 1.5s; }
        .animate-glow-3 { animation: glowPulse 6s ease-in-out infinite 3s; }
      `}} />

      {/* Buline / Bule luminoase care se sting și se aprind pe background (elimină aspectul trist) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-8 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-brand-orange/25 rounded-full blur-[120px] animate-glow-1" />
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-brand-orange/20 rounded-full blur-[140px] animate-glow-2" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 sm:w-[400px] sm:h-[400px] bg-brand-orange/15 rounded-full blur-[110px] animate-glow-3" />
      </div>

      {/* 🍊 STRATUL DE CĂDERE A PORTOCALELOR (CU EVITARE DE MOUSE) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        <AnimatePresence>
          {fallingOranges.map((orange) => (
            <FallingOrangeItem key={orange.id} orange={orange} mouseRef={mouseRef} />
          ))}
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        
        {/* Titlu mărit, cu "Proiectele" (alb) și "Noastre" (portocaliu) */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-brand-orange mb-3">
            {t('subtitle')}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
            <span className="text-brand-white">Proiectele </span>
            <span className="text-brand-orange drop-shadow-[0_0_25px_rgba(255,107,0,0.5)]">Noastre</span>
          </h2>
          <div ref={spawnRef} className="w-full h-1 mt-6" />
        </div>

        {loading ? (
          <div className="text-center text-brand-white/60 text-base">Se încarcă proiectele...</div>
        ) : fetchError ? (
          <div className="text-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            Eroare: {fetchError}
          </div>
        ) : !projects || projects.length === 0 ? (
          <p className="text-center text-brand-white/60 text-base">{t('noProjects')}</p>
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

// Subcomponentă care gestionează mișcarea portocalei și o ferește rapid când cursorul se apropie
function FallingOrangeItem({ orange, mouseRef }: { orange: FallingOrange; mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const [deflectX, setDeflectX] = useState(0)
  const [deflectY, setDeflectY] = useState(0)
  const itemRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let animationFrameId: number
    const updatePosition = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect()
        const orangeCenterX = rect.left + rect.width / 2
        const orangeCenterY = rect.top + rect.height / 2

        const dx = orangeCenterX - mouseRef.current.x
        const dy = orangeCenterY - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Dacă mouse-ul se apropie, portocala se dă rapid la o parte
        const repelRadius = 180
        if (distance < repelRadius && distance > 0) {
          const force = (1 - distance / repelRadius) * 130
          setDeflectX((dx / distance) * force)
          setDeflectY((dy / distance) * force)
        } else {
          setDeflectX(0)
          setDeflectY(0)
        }
      }
      animationFrameId = requestAnimationFrame(updatePosition)
    }
    animationFrameId = requestAnimationFrame(updatePosition)
    return () => cancelAnimationFrame(animationFrameId)
  }, [mouseRef])

  return (
    <motion.img
      ref={itemRef}
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
        x: `calc(-50% + ${orange.xOffset + deflectX}px)`,
        y: window.innerHeight * 1.2 + deflectY,
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
  )
}