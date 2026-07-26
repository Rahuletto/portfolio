import type { ComponentType } from 'react'
import { projects } from '../data/projects.ts'

type ProjectMediaProps = {
  image: string
  hoverImage: string
  effect: number
}

type ProjectsSectionProps = {
  Media: ComponentType<ProjectMediaProps>
}

export function ProjectsSection({ Media }: ProjectsSectionProps) {
  return (
    <section className="projects" id="work" aria-label="Selected work">
      {projects.map((project) => (
        <article
          className={`project group ${project.wide ? 'project--wide' : ''} ${project.compact ? 'project--compact' : ''} ${project.portrait ? 'project--portrait' : ''}`}
          key={project.name}
        >
          <div className="project-media">
            <Media
              image={project.image}
              hoverImage={project.hover}
              effect={project.effect}
            />
            {project.name !== 'Product experiences' && (
              <span className="project-badge">Selected project</span>
            )}
          </div>
          <div className="project-caption">
            <h3>{project.name}</h3>
            <p>{project.year}</p>
          </div>
        </article>
      ))}
    </section>
  )
}
