'use client'

import { HeroSection } from '@/components/home/landing/hero-section'
import { MembersGrid } from '@/components/home/landing/members-grid'
import { AboutSection } from '@/components/home/landing/about-section'
import { ProjectsSection } from '@/components/home/landing/projects-section'
import { ContactFooter } from '@/components/home/landing/contact-footer'
import { OrbField } from '@/components/orb-field'

export function TeamLanding() {
  return (
    <div className="bg-brand-black text-brand-white">
      <HeroSection />

      {/* Container comun cu OrbField pentru fundalul fluid între MembersGrid și AboutSection */}
      <div className="relative overflow-hidden">
        <OrbField variant="mono" />
        <MembersGrid />
        <AboutSection />
      </div>

      <ProjectsSection />
      <ContactFooter />
    </div>
  )
}