'use client'

import { useTeam } from '@/components/team-context'
import { TeamLanding } from '@/components/home/team-landing'
import { Variant1 } from '@/components/home/variants/variant-1'
import { Variant2 } from '@/components/home/variants/variant-2'
import { Variant3 } from '@/components/home/variants/variant-3'
import { Variant4 } from '@/components/home/variants/variant-4'
import { Variant5 } from '@/components/home/variants/variant-5'
import { Variant6 } from '@/components/home/variants/variant-6'

export function HomeView() {
  const { activeMember } = useTeam()

  if (!activeMember) {
    return <TeamLanding />
  }

  switch (activeMember.themeVariant) {
    case 1:
      return <Variant1 member={activeMember} />
    case 2:
      return <Variant2 member={activeMember} />
    case 3:
      return <Variant3 member={activeMember} />
    case 4:
      return <Variant4 member={activeMember} />
    case 5:
      return <Variant5 member={activeMember} />
    case 6:
      return <Variant6 member={activeMember} />
    default:
      return <Variant1 member={activeMember} />
  }
}
