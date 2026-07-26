import type { ComponentType } from 'react'

type ModelSceneProps = {
  model: string
  variant: 'hello' | 'cursor' | 'finale'
}

type FinaleSectionProps = {
  Model: ComponentType<ModelSceneProps>
}

export function FinaleSection({ Model }: FinaleSectionProps) {
  return (
    <footer className="finale" id="contact">
      <Model model="/assets/025-cnt.gltf" variant="finale" />
      <h2>Let’s create<br />something<br /><span>extraordinary</span></h2>
      <p className="email">Available for ambitious work ↗</p>
      <div className="footer-row">
        <p>DESIGN · CODE · AI<br />MARBAN © 2026</p>
        <div>
          <a href="#top">Home</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  )
}
