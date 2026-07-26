import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Defers mounting children until the user scrolls within `rootMargin` of
 * this element. Keeps the sentinel div so the outer layout doesn't shift.
 * Once mounted, stays mounted permanently.
 */
export function LazySection({
  children,
  rootMargin = '800px',
}: {
  children: ReactNode
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) return
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mounted, rootMargin])

  return (
    <div ref={mounted ? undefined : ref}>
      {mounted ? children : null}
    </div>
  )
}
