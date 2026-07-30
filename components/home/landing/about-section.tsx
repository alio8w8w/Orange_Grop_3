'use client'

import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations('About')

  return (
    <section
      id="about"
      className="relative z-10 border-t border-brand-white/10 py-16 sm:py-24 lg:py-28 bg-transparent"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          
          {/* Partea stângă cu efect de intro */}
          <div className="animate-fade-in transition-all duration-700">
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
              {t('subtitle')}
            </p>
            <h2 className="mt-3 font-display text-2xl font-black uppercase leading-[1.1] tracking-tight text-brand-white sm:text-3xl lg:text-4xl">
              {t('headingPart1')}{' '}
              <span className="text-brand-orange">{t('headingHighlight')}</span>
            </h2>
          </div>

          {/* Partea dreaptă cu efect de intro întârziat */}
          <div className="animate-fade-in transition-all duration-700 delay-150">
            <div className="space-y-4 sm:space-y-5">
              <p className="text-sm sm:text-base leading-relaxed text-brand-white/80">
                {t('p1')}
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-brand-white/70">
                {t('p2')}
              </p>
            </div>

            {/* Carduri de valori */}
            <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:mt-10">
              <li className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-4 sm:p-5 backdrop-blur-sm transition-transform duration-300 hover:border-brand-orange/40 hover:-translate-y-1">
                <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-brand-orange">
                  {t('values.v1Label')}
                </span>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-brand-white/60">
                  {t('values.v1Detail')}
                </p>
              </li>

              <li className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-4 sm:p-5 backdrop-blur-sm transition-transform duration-300 hover:border-brand-orange/40 hover:-translate-y-1">
                <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-brand-orange">
                  {t('values.v2Label')}
                </span>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-brand-white/60">
                  {t('values.v2Detail')}
                </p>
              </li>

              <li className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-4 sm:p-5 backdrop-blur-sm transition-transform duration-300 hover:border-brand-orange/40 hover:-translate-y-1">
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