import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react'

type RevealProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  delay?: number
  className?: string
  variant?: 'default' | 'slide-left' | 'slide-right'
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

const Reveal = <T extends ElementType = 'div'>({
  as,
  children,
  delay = 0,
  className = '',
  variant = 'default',
  style,
  ...rest
}: RevealProps<T>) => {
  const Component = (as || 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Enter/exit thresholds tuned so fade-out starts slightly before the element fully leaves view
    const enterRatio = 0.2
    const exitRatio = 0.1

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      node.classList.add('reveal-visible')
      node.style.setProperty('--reveal-opacity', '1')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio
          const target = entry.target as HTMLElement
          // Ease-out curve to shorten mid-transparency time (quadratic)
          const normalized = Math.min(1, Math.max(0, ratio * 1.4))
          const easedOpacity = 1 - Math.pow(1 - normalized, 2)
          target.style.setProperty('--reveal-opacity', easedOpacity.toString())

          // Fade in when sufficiently visible, fade out when mostly gone or fully out of view
          if (ratio >= enterRatio) {
            target.classList.add('reveal-visible')
          } else if (ratio <= exitRatio || !entry.isIntersecting) {
            target.classList.remove('reveal-visible')
          }
        })
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
        rootMargin: '-5% 0px -5% 0px',
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const shift = (() => {
    if (variant === 'slide-left') return { x: '-28px', y: '6px' }
    if (variant === 'slide-right') return { x: '28px', y: '6px' }
    return { x: '0px', y: '18px' }
  })()

  return (
    <Component
      ref={ref}
      className={`reveal ${className}`}
      style={{
        ...style,
        ['--reveal-delay' as string]: `${delay}ms`,
        ['--reveal-shift-x' as string]: shift.x,
        ['--reveal-shift-y' as string]: shift.y,
      }}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Reveal
