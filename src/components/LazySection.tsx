import { useEffect, useRef, useState, type ReactNode } from 'react'

export function LazySection({
  children,
  rootMargin = '150px',
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
