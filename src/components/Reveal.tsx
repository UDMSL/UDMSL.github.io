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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      node.classList.add('reveal-visible')
      node.style.setProperty('--reveal-opacity', '1')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // A tall section may never reach a percentage threshold on mobile.
          // Reveal once on entry and keep content fully readable afterwards.
          if (!entry.isIntersecting) return
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0,
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
