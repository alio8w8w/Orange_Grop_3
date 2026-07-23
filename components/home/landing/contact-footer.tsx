import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import { OrbField } from '@/components/orb-field'

const CONTACTS = [
  { icon: Mail, label: 'Email', value: 'hello@orangegroup3.com' },
  { icon: Phone, label: 'Phone', value: '+1 (123) 456-7890' },
  { icon: Globe, label: 'Website', value: 'orangegroup3.com' },
  { icon: MapPin, label: 'Studio', value: 'New York · Remote' },
]

export function ContactFooter() {
  return (
    <footer
      id="contacts"
      className="relative overflow-hidden border-t border-brand-white/10 pt-20 sm:pt-28"
    >
      <OrbField variant="warm" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
              Contacts
            </p>
            <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-balance text-brand-white sm:text-6xl">
              Let&apos;s build
              <br />
              <span className="text-brand-orange">something bold.</span>
            </h2>
            <a
              href="mailto:hello@orangegroup3.com"
              className="mt-8 inline-flex rounded-full bg-brand-orange px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-brand-black transition-transform hover:scale-105"
            >
              Start a project
            </a>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {CONTACTS.map(({ icon: Icon, label, value }) => (
              <li
                key={label}
                className="rounded-xl border border-brand-white/10 bg-brand-white/[0.03] p-5"
              >
                <span className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <p className="mt-2 truncate text-sm text-brand-white/80">
                  {value}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-white/10 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center bg-brand-orange font-display text-sm font-black text-brand-black">
              O
            </span>
            <span className="font-display text-sm font-extrabold uppercase tracking-tight text-brand-white">
              Orange<span className="text-brand-orange">/</span>Group 3
            </span>
          </div>
          <p className="text-xs text-brand-white/40">
            © {new Date().getFullYear()} Orange Group 3. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
