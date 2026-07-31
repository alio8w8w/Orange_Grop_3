// components/home/landing/about-section.tsx
'use client'

import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations('About')

  return (
    <section
      id="about"
      className="relative z-10 overflow-hidden border-t border-brand-white/10 py-16 sm:py-24 lg:py-28 bg-transparent"
    >
      {/* Stiluri CSS pentru animații */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marqueeLeftToRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes colorCycleAbout {
          0%, 100% { color: #ffffff; }
          33% { color: #f97316; }
          66% { color: #9ca3af; }
        }
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .bg-about-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: 
            marqueeLeftToRight 22s linear infinite, 
            colorCycleAbout 12s ease-in-out infinite;
        }
        .animate-enter-left {
          animation: slideInFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Fundal cu textul din JSON */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-80 select-none overflow-hidden">
        <span className="bg-about-marquee font-display text-[8rem] sm:text-[14rem] lg:text-[18rem] font-black uppercase tracking-tighter">
          {t('subtitle')} • {t('subtitle')} • {t('subtitle')}
        </span>
      </div>

      {/* Container principal mărit și mutat ușor spre dreapta */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:pl-16">
        
        {/* Layout pe 2 coloane: Poza în stânga, Cadrul cu text în dreapta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* POZA DIN STANGA (Nume corectat: about-photo.png și înălțime egală pe axa Y) */}
          <div className="lg:col-span-4 animate-enter-left flex">
            <div className="relative w-full h-full min-h-[400px] sm:min-h-full rounded-2xl sm:rounded-3xl border border-brand-white/15 overflow-hidden shadow-2xl bg-brand-white/[0.02] backdrop-blur-xl">
              <img
                src="/images/about-photo.png"
                alt="Despre mine"
                className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* FRAME / CADRU BLURAT CU TEXTUL (Înălțime egală pe axa Y) */}
          <div className="lg:col-span-8 animate-enter-left rounded-2xl sm:rounded-3xl border border-brand-white/15 bg-brand-black/40 sm:bg-brand-white/[0.04] p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              {/* Antet Secțiune */}
              <div className="max-w-3xl">
                <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
                  {t('subtitle')}
                </p>
                <h2 className="mt-3 font-display text-2xl font-black uppercase leading-[1.1] tracking-tight text-brand-white sm:text-3xl lg:text-4xl">
                  {t('headingPart1')}{' '}
                  <span className="text-brand-orange">{t('headingHighlight')}</span>
                </h2>
              </div>

              {/* Paragraf Descriere */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <p className="text-sm sm:text-base leading-relaxed text-brand-white/80">
                  {t('p1')}
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-brand-white/70">
                  {t('p2')}
                </p>
              </div>
            </div>

            {/* Carduri de Valori */}
            <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:mt-10">
              <li className="rounded-xl border border-brand-white/10 bg-brand-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-brand-orange/50 hover:bg-brand-white/[0.08] hover:-translate-y-1">
                <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-brand-orange">
                  {t('values.v1Label')}
                </span>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-brand-white/60">
                  {t('values.v1Detail')}
                </p>
              </li>

              <li className="rounded-xl border border-brand-white/10 bg-brand-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-brand-orange/50 hover:bg-brand-white/[0.08] hover:-translate-y-1">
                <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-brand-orange">
                  {t('values.v2Label')}
                </span>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-brand-white/60">
                  {t('values.v2Detail')}
                </p>
              </li>

              <li className="rounded-xl border border-brand-white/10 bg-brand-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-brand-orange/50 hover:bg-brand-white/[0.08] hover:-translate-y-1">
                <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-brand-orange">
                  {t('values.v3Label')}
                </span>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-brand-white/60">
                  {t('values.v3Detail')}
                </p>
              </li>
            </ul>

          </div>

        </div>

      </div>
    </section>
  )
}