'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { teamProjects } from '@/lib/team-data'

export function ProjectsSection() {
  const scroller = useRef<HTMLUListElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-brand-white/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
              Together
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-brand-white sm:text-5xl">
              Common Projects
            </h2>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-brand-white/60">
              Work we conceived, designed and shipped as one team.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous projects"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-white/15 text-brand-white/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next projects"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-white/15 text-brand-white/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ul
          ref={scroller}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {teamProjects.map((project) => (
            <li
              key={project.id}
              className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[32%]"
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-white/10 bg-brand-white/[0.03]">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={project.image || '/placeholder.svg'}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 85vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
                      {project.category}
                    </span>
                    <span className="text-xs text-brand-white/40">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-extrabold text-brand-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-white/60">
                    {project.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
