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

  // Verificăm dacă membrul selectat este Yana (Variant3)
  const isYana = 
    memberData.id === '7dffb2d4-60e7-43fb-b658-d5cfc9bbf8' || 
    memberData.nume?.toLowerCase() === 'yana' || 
    memberData.prenume?.toLowerCase() === 'yana'

  if (isYana) {
    return <Variant3 member={memberData} />
  }

  // Verificăm dacă membrul selectat este Ana / Ilina (Variant2)
  const isAna = 
    memberData.nume?.toLowerCase() === 'ana' || 
    memberData.prenume?.toLowerCase() === 'ana' ||
    memberData.nume?.toLowerCase() === 'ilina' ||
    memberData.prenume?.toLowerCase() === 'ilina'

  if (isAna) {
    return <Variant2 member={memberData} />
  }

  // Verificăm dacă membrul selectat este Nikita (Variant4)
  const isNikita = 
    memberData.nume?.toLowerCase() === 'nikita' || 
    memberData.prenume?.toLowerCase() === 'nikita'

  if (isNikita) {
    return <Variant4 member={memberData} />
  }

  switch (activeMember.themeVariant) {
    case 1:
      return <Variant1 />
    case 2:
      return <Variant2 member={memberData} />
    case 3:
      return <Variant3 member={memberData} />
    case 4:
      return <Variant4 member={memberData} />
    default:
      return <Variant1 />
  }
}