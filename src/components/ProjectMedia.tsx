import { useEffect, useRef } from 'react'
import { sharedProjectGL } from '../engine/sharedProjectGL.ts'

export function ProjectMedia({ image, hoverImage }: { image: string; hoverImage: string; effect?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (!hoverImage || hoverImage === image) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const cardId = image.replace(/[^a-zA-Z0-9]/g, '_')

    sharedProjectGL.preloadTexture(image)
    sharedProjectGL.preloadTexture(hoverImage)

    const onPointerEnter = () => {
      sharedProjectGL.startHover(cardId, image, hoverImage, canvas)
    }

    const onPointerLeave = () => {
      sharedProjectGL.stopHover(cardId, image, hoverImage, canvas)
    }

    wrap.addEventListener('pointerenter', onPointerEnter, { passive: true })
    wrap.addEventListener('pointerleave', onPointerLeave, { passive: true })

    return () => {
      wrap.removeEventListener('pointerenter', onPointerEnter)
      wrap.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [hoverImage, image])

  return (
    <div className="project-shader relative w-full overflow-hidden" ref={wrapRef}>
      <img className="block w-full" src={`/assets/projects/${image}`} alt="" loading="lazy" />
      <canvas
        className="absolute inset-0 z-[1] size-full opacity-0 transition-opacity duration-[350ms]"
        ref={canvasRef}
        aria-hidden="true"
      />
    </div>
  )
}
