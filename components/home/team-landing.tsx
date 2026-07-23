'use client'

import { HeroSection } from '@/components/home/landing/hero-section'
import { MembersGrid } from '@/components/home/landing/members-grid'
import { AboutSection } from '@/components/home/landing/about-section'
import { ProjectsSection } from '@/components/home/landing/projects-section'
import { ContactFooter } from '@/components/home/landing/contact-footer'

export function TeamLanding() {
  return (
    <div className="bg-brand-black text-brand-white">
      <HeroSection />
      <MembersGrid />
      <AboutSection />
      <ProjectsSection />
      <ContactFooter />
    </div>
  )
}
