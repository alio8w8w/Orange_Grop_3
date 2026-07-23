import { cn } from '@/lib/utils'

/**
 * Animated, glowing blurred background orbs (orbs) rendered behind content.
 * Purely decorative — hidden from assistive tech. Place inside a relatively
 * positioned, overflow-hidden container.
 */
export function OrbField({
  className,
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'warm' | 'mono'
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-0 overflow-hidden',
        className,
      )}
    >
      <span className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-orange/30 blur-3xl animate-orb-a" />
      <span
        className={cn(
          'absolute right-[-10%] top-1/3 h-96 w-96 rounded-full blur-3xl animate-orb-b',
          variant === 'mono' ? 'bg-brand-white/10' : 'bg-brand-orange/20',
        )}
      />
      <span
        className={cn(
          'absolute bottom-[-15%] left-1/3 h-72 w-72 rounded-full blur-3xl animate-orb-c',
          variant === 'warm' ? 'bg-brand-orange/25' : 'bg-brand-orange/15',
        )}
      />
    </div>
  )
}
