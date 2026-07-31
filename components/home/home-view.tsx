'use client'

import { useTeam } from '@/components/team-context'
import { TeamLanding } from '@/components/home/team-landing'
import { Variant1 } from '@/components/home/variants/variant-1'
import { Variant2 } from '@/components/home/variants/variant-2'
import { Variant3 } from '@/components/home/variants/variant-3'
import { Variant4 } from '@/components/home/variants/variant-4'

export function HomeView() {
  const { activeMember } = useTeam()

  if (!activeMember) {
    return <TeamLanding />
  }

  // Folosim "as any" pentru a rezolva conflictul de tipuri generat de TypeScript
  const memberData = activeMember as any

  switch (activeMember.themeVariant) {
    case 1:
      return <Variant1 member={memberData} />
    case 2:
      return <Variant2 member={memberData} />
    case 3:
      return <Variant3 member={memberData} />
    case 4:
      return <Variant4 member={memberData} />
    default:
      return <Variant1 member={memberData} />
  }
}