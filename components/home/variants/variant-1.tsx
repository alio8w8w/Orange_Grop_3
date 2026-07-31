'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Award,
  ChevronDown,
} from 'lucide-react'
import { useTeam } from '@/components/team-context'
import { useTranslations } from 'next-intl'

// ─────────────────────────────────────────────────────────────
// TIPURI
// ─────────────────────────────────────────────────────────────

interface CVMember {
  id: string
  nume: string
  prenume: string
  telefon: string
  email: string
  localitate: string
  poza_url: string
  data_nasterii?: string
  functie: string
  biografie?: string
  descriere?: string
  experienta: any[]
  educatie: any[]
  limbi: any[]
  skills: string[]
  permis_conducere?: string[]
  portofoliu: any[]
  social_links?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    tiktok?: string
  }
  hero_url?: string
}

// Paleta de referință (album "ZERO : FEVER Part.2")
const PALETTE = {
  cream: '#FCF5AF',
  amber: '#F0A533',
  orange: '#E44F0A',
  red: '#BA011A',
  navy: '#0B4B8B',
  black: '#000000',
}

// ─────────────────────────────────────────────────────────────
// COMPONENTA PRINCIPALĂ (VARIANT 1)
// ─────────────────────────────────────────────────────────────

export function Variant1({ member }: { member: CVMember }) {
  const { setActiveMemberId } = useTeam()
  const t = useTranslations('Variant1')

  if (!member) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <p className="text-2xl font-bold">{t('profileNotFound')}</p>
        <button
          onClick={() => setActiveMemberId(null)}
          className="mt-4 text-[#E44F0A] underline"
        >
          {t('backToTeam')}
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FCF5AF] text-black selection:bg-[#E44F0A] selection:text-white">
      <StoryHero member={member} onBack={() => setActiveMemberId(null)} t={t} />
      <WaveDivider />

      <div className="relative mx-auto max-w-5xl px-6 pb-32 sm:px-10">
        <ChapterConnector index="01" />
        <AboutChapter member={member} t={t} />

        <ChapterConnector index="02" />
        <SkillsChapter member={member} t={t} />

        <ChapterConnector index="03" />
        <JourneyChapter member={member} t={t} />

        <ChapterConnector index="04" />
        <GalleryChapter member={member} t={t} />

        <ChapterConnector index="05" />
        <ContactChapter member={member} t={t} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────

function StoryHero({
  member,
  onBack,
  t,
}: {
  member: CVMember
  onBack: () => void
  t: ReturnType<typeof useTranslations>
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const title = t('heroTitle')
  const letters = title.split('')

  return (
    <div className="relative flex h-[100svh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-black">
      {/* Fundal blurat permanent + zoom lent */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.06, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={member.hero_url || member.poza_url || '/placeholder.svg'}
          alt=""
          fill
          priority
          className="scale-110 object-cover blur-2xl brightness-[0.55] saturate-125"
        />
      </motion.div>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(11,75,139,0.35) 45%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Buton înapoi */}
      <motion.button
        type="button"
        onClick={onBack}
        initial={{ opacity: 0, y: -12 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute left-6 top-8 z-20 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-white/75 transition-colors hover:text-[#F0A533] sm:left-10"
      >
        <ArrowLeft className="h-5 w-5" /> {t('backToTeam')}
      </motion.button>

      {/* Titlu animat */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={mounted ? { opacity: 1, letterSpacing: '0.4em' } : {}}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="mb-4 font-serif text-sm italic text-[#F0A533] sm:text-base"
        >
          {t('heroEyebrow')}
        </motion.span>

        <h1 className="flex flex-wrap justify-center font-display text-6xl font-black uppercase leading-[0.95] text-[#FCF5AF] sm:text-8xl lg:text-9xl">
          {letters.map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              initial={{ opacity: 0, y: 40, rotate: -6 }}
              animate={mounted ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{
                delay: 0.4 + i * 0.05,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={ch === ' ' ? 'w-4' : undefined}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 + letters.length * 0.05 + 0.3, duration: 0.7 }}
          className="mt-6 max-w-md font-display text-base font-bold uppercase tracking-widest text-white/80 sm:text-lg"
        >
          {member.prenume} {member.nume} · {member.functie}
        </motion.p>
      </div>

      {/* Indicator scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-24 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-8 w-8 text-[#F0A533]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// WAVE DIVIDER
// ─────────────────────────────────────────────────────────────

function WaveDivider() {
  return (
    <div className="relative -mt-1 h-24 w-full overflow-hidden sm:h-32 lg:h-40">
      <svg
        className="absolute bottom-0 left-0 h-full w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C240,180 480,60 720,100 C960,140 1200,60 1440,110 L1440,200 L0,200 Z"
          fill={PALETTE.navy}
          opacity={0.35}
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 h-full w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 C300,90 600,190 900,130 C1150,80 1300,150 1440,120 L1440,200 L0,200 Z"
          fill={PALETTE.cream}
        />
      </svg>
    </div>
  )
}

function ChapterConnector({ index }: { index: string }) {
  return (
    <div className="relative mx-auto flex h-20 w-full items-center justify-center sm:h-24">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ transformOrigin: 'top' }}
        className="absolute h-full w-[3px] rounded-full bg-[#0B4B8B]/25"
      />
      <motion.span
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        whileInView={{ scale: 1, rotate: -8, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ delay: 0.3, duration: 0.5, ease: 'backOut' }}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0B4B8B] bg-[#FCF5AF] font-display text-xs font-black text-[#0B4B8B] shadow-md"
      >
        {index}
      </motion.span>
    </div>
  )
}

function ChapterTitle({ eyebrow, title, color }: { eyebrow: string; title: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6 }}
      className="mb-10 text-center"
    >
      <span className="font-serif text-sm italic text-neutral-600">{eyebrow}</span>
      <h2
        className="mt-1 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl"
        style={{ color }}
      >
        {title}
      </h2>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// CAPITOLELE 1–5
// ─────────────────────────────────────────────────────────────

function AboutChapter({ member, t }: { member: CVMember; t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="py-4">
      <ChapterTitle eyebrow={t('chapters.about')} title={t('aboutTitle', { nume: member.nume })} color={PALETTE.red} />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -6 }}
          whileInView={{ opacity: 1, x: 0, rotate: -3 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-fit"
        >
          <div className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rotate-[-4deg] bg-[#F0A533]/70 shadow-sm" />
          <div className="absolute -right-6 -top-6 z-10 rotate-[10deg] rounded-full bg-[#BA011A] px-4 py-2 text-xs font-bold text-white shadow-lg">
            {t('aboutSticker')}
          </div>
          <div className="relative rounded-sm border-8 border-white bg-white p-2 shadow-2xl">
            <div className="relative h-72 w-64 overflow-hidden sm:h-80 sm:w-72">
              <Image
                src={member.poza_url || '/placeholder.svg'}
                alt={`${member.nume} ${member.prenume}`}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 pb-2 text-center font-serif text-sm italic text-neutral-600">
              {member.prenume} {member.nume}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-3xl border-2 border-dashed border-[#0B4B8B]/40 bg-white/70 p-8 shadow-inner"
        >
          <p className="text-lg font-medium leading-relaxed text-neutral-800 sm:text-xl">
            {member.descriere || member.biografie || t('defaultBio')}
          </p>
          {member.data_nasterii && (
            <p className="mt-4 text-sm font-bold text-[#E44F0A]">
              {t('birthdate')}: <span className="text-neutral-900">{member.data_nasterii}</span>
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function SkillsChapter({ member, t }: { member: CVMember; t: ReturnType<typeof useTranslations> }) {
  const colors = [PALETTE.amber, PALETTE.orange, PALETTE.red, PALETTE.navy]

  return (
    <section className="py-4">
      <ChapterTitle eyebrow={t('chapters.skills')} title={t('skillsTitle')} color={PALETTE.navy} />

      <div className="flex flex-wrap justify-center gap-4">
        {member.skills && member.skills.length > 0 ? (
          member.skills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.6, rotate: idx % 2 === 0 ? -8 : 8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: idx % 2 === 0 ? -3 : 3 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: idx * 0.05, duration: 0.5, ease: 'backOut' }}
              whileHover={{ scale: 1.08, rotate: 0 }}
              className="rounded-full px-6 py-3 text-base font-bold text-white shadow-lg"
              style={{ backgroundColor: colors[idx % colors.length] }}
            >
              {typeof skill === 'string' ? skill.replace('[Soft] ', '').replace('[Hard] ', '') : JSON.stringify(skill)}
            </motion.div>
          ))
        ) : (
          <p className="text-neutral-500">{t('skillsMissing')}</p>
        )}
      </div>

      {member.limbi && member.limbi.length > 0 && (
        <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
          {member.limbi.map((l: any, idx: number) => (
            <motion.div
              key={l.id ?? idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="flex items-center justify-between rounded-xl border border-[#0B4B8B]/20 bg-white/70 px-4 py-2"
            >
              <span className="flex items-center gap-2 font-bold text-neutral-800">
                <Globe size={16} className="text-[#0B4B8B]" /> {l.limba}
              </span>
              <span className="rounded-full bg-[#0B4B8B] px-3 py-1 text-xs font-semibold text-white">
                {l.nivel}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}

function JourneyChapter({ member, t }: { member: CVMember; t: ReturnType<typeof useTranslations> }) {
  type Entry = {
    key: string
    kind: 'edu' | 'exp'
    periodStart?: string
    periodEnd?: string
    title: string
    subtitle?: string
    desc?: string
  }

  const eduEntries: Entry[] = (member.educatie || []).map((edu: any) => ({
    key: `edu-${edu.id}`,
    kind: 'edu',
    periodStart: edu.data_inceput,
    periodEnd: edu.data_sfarsit,
    title: edu.institutie,
    subtitle: edu.specializare || edu.specialitate,
    desc: edu.descriere,
  }))

  const expEntries: Entry[] = (member.experienta || []).map((exp: any) => ({
    key: `exp-${exp.id}`,
    kind: 'exp',
    periodStart: exp.data_inceput || exp.perioada,
    periodEnd: exp.data_sfarsit,
    title: exp.functie,
    subtitle: exp.companie,
    desc: exp.descriere,
  }))

  const timeline = [...eduEntries, ...expEntries]

  return (
    <section className="py-4">
      <ChapterTitle eyebrow={t('chapters.journey')} title={t('journeyTitle')} color={PALETTE.orange} />

      {timeline.length === 0 ? (
        <p className="text-center text-neutral-500">{t('journeyMissing')}</p>
      ) : (
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-[#0B4B8B]/20 sm:block" />
          <div className="flex flex-col gap-8">
            {timeline.map((entry, idx) => {
              const isLeft = idx % 2 === 0
              const isEdu = entry.kind === 'edu'
              return (
                <motion.div
                  key={entry.key}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex sm:w-1/2 ${isLeft ? 'sm:pr-8' : 'sm:ml-auto sm:pl-8'}`}
                >
                  <div
                    className="w-full rounded-2xl border-2 bg-white p-6 shadow-md"
                    style={{ borderColor: isEdu ? PALETTE.navy : PALETTE.red }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {isEdu ? (
                        <GraduationCap size={20} style={{ color: PALETTE.navy }} />
                      ) : (
                        <Briefcase size={20} style={{ color: PALETTE.red }} />
                      )}
                      <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                        {entry.periodStart} — {entry.periodEnd || t('present')}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold uppercase text-neutral-900">{entry.title}</h4>
                    {entry.subtitle && (
                      <p className="mt-1 text-sm font-medium text-neutral-700">{entry.subtitle}</p>
                    )}
                    {entry.desc && <p className="mt-2 text-xs text-neutral-500">{entry.desc}</p>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {member.permis_conducere && member.permis_conducere.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            {t('licenseLabel')}
          </span>
          <div className="flex gap-2">
            {member.permis_conducere.map((cat, idx) => (
              <span
                key={idx}
                className="rounded-md border border-[#0B4B8B]/30 bg-white px-3 py-1 text-xs font-bold text-[#0B4B8B]"
              >
                {t('categoryLabel')} {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function GalleryChapter({ member, t }: { member: CVMember; t: ReturnType<typeof useTranslations> }) {
  const rotations = [-4, 3, -2, 5, -5, 2]

  return (
    <section className="py-4">
      <ChapterTitle eyebrow={t('chapters.gallery')} title={t('galleryTitle')} color={PALETTE.red} />

      {member.portofoliu && member.portofoliu.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {member.portofoliu.map((item: any, idx: number) => (
            <motion.div
              key={item.id ?? idx}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: rotations[idx % rotations.length] }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
              whileHover={{ rotate: 0, scale: 1.04 }}
              className="relative rounded-sm border-8 border-white bg-white p-2 shadow-xl"
            >
              <div className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-2 bg-[#F0A533]/70" />
              <div className="p-3">
                <h4 className="font-bold text-neutral-900">{item.titlu}</h4>
                <p className="mt-1 text-sm text-neutral-600">{item.descriere}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs font-semibold text-[#E44F0A] underline"
                  >
                    {t('galleryCta')} →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500">{t('galleryEmpty')}</p>
      )}
    </section>
  )
}

function ContactChapter({ member, t }: { member: CVMember; t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="overflow-hidden rounded-[2.5rem] bg-black text-white shadow-2xl"
      >
        <div className="grid md:grid-cols-2">
          <div className="p-10 sm:p-14">
            <span className="font-serif text-sm italic text-[#F0A533]">{t('chapters.contact')}</span>
            <h2 className="mt-2 font-display text-4xl font-black uppercase leading-tight sm:text-5xl">
              {t('contactTitle')}
            </h2>
            <p className="mt-4 max-w-sm text-neutral-400">{t('contactSubtitle')}</p>

            <div className="mt-8 flex gap-4">
              {member.social_links?.instagram && (
                <SocialIcon href={member.social_links.instagram} color={PALETTE.amber} label="Instagram" />
              )}
              {member.social_links?.linkedin && (
                <SocialIcon href={member.social_links.linkedin} color={PALETTE.navy} label="LinkedIn" />
              )}
              {member.social_links?.facebook && (
                <SocialIcon href={member.social_links.facebook} color={PALETTE.orange} label="Facebook" />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 border-t border-neutral-800 bg-neutral-950 p-10 sm:p-14 md:border-l md:border-t-0">
            <ContactRow icon={<Phone />} text={member.telefon} />
            <ContactRow icon={<Mail />} text={member.email} />
            <ContactRow icon={<MapPin />} text={member.localitate} />
          </div>
        </div>
      </motion.div>

      <p className="mt-10 text-center font-serif text-lg italic text-neutral-500">{t('theEnd')}</p>
    </section>
  )
}

function SocialIcon({ href, color, label }: { href: string; color: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 transition-transform hover:scale-110"
      style={{ color }}
    >
      <Award size={20} />
    </a>
  )
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  if (!text) return null
  return (
    <div className="flex items-center gap-4 text-xl font-medium text-neutral-300">
      <div className="text-[#F0A533]">{icon}</div>
      <span>{text}</span>
    </div>
  )
}