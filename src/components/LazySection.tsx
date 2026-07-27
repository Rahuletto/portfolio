import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Defers mounting section children until the user scrolls within `rootMargin` of
 * this element. Keeps sentinel div so outer layout doesn't shift.
 */
export function LazySection({
  children,
  rootMargin = '350px',
  minHeight,
  className = '',
}: {
  children: ReactNode
  rootMargin?: string
  minHeight?: string
  className?: string
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
    <div
      ref={mounted ? undefined : ref}
      className={className}
      style={{ minHeight: !mounted && minHeight ? minHeight : undefined }}
    >
      {mounted ? children : null}
    </div>
  )
}

/**
 * Defers mounting individual items inside sections (e.g. Project Cards)
 * until they enter the viewport margin.
 */
export function LazyItem({
  children,
  rootMargin = '300px',
  className = '',
}: {
  children: ReactNode
  rootMargin?: string
  className?: string
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
    <div ref={mounted ? undefined : ref} className={className}>
      {mounted ? children : <div className="min-h-[300px] w-full rounded-2xl bg-white/5 animate-pulse" />}
    </div>
  )
}
