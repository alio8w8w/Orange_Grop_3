import { OrbField } from '@/components/orb-field'
import { teamAbout } from '@/lib/team-data'

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-brand-white/10 py-20 sm:py-28"
    >
      <OrbField variant="mono" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
              About Us
            </p>
            <h2 className="mt-4 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight text-balance text-brand-white sm:text-4xl">
              {teamAbout.heading}
            </h2>
          </div>

          <div>
            <div className="space-y-5">
              {teamAbout.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-pretty leading-relaxed text-brand-white/70"
                >
                  {p}
                </p>
              ))}
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {teamAbout.values.map((v) => (
                <li
                  key={v.label}
                  className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-5"
                >
                  <span className="font-display text-sm font-extrabold uppercase tracking-wide text-brand-orange">
                    {v.label}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-brand-white/60">
                    {v.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
