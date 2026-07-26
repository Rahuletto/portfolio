import type { ComponentType, CSSProperties } from 'react'
import { projects } from '../data/projects.ts'
import { useScrollReveal } from '../hooks/useScrollReveal.ts'

type ProjectMediaProps = {
  image: string
  hoverImage: string
  effect: number
}

type ProjectsSectionProps = {
  Media: ComponentType<ProjectMediaProps>
}

function projectLayout(
  index: number,
  project: (typeof projects)[number],
): string {
  if (project.compact) return 'col-start-6 col-span-3 max-[760px]:col-start-auto max-[760px]:col-span-1'
  if (project.portrait) return 'col-start-2 col-span-4 max-[760px]:col-start-auto max-[760px]:col-span-2'
  if (project.wide) return 'col-start-5 col-span-6 max-[760px]:col-start-auto max-[760px]:col-span-2'
  if ((index + 1) % 4 === 0) return 'col-start-7 col-span-4 max-[760px]:col-start-auto max-[760px]:col-span-2'
  if ((index + 1) % 3 === 0) return 'col-start-2 col-span-5 max-[760px]:col-start-auto max-[760px]:col-span-1'
  return 'col-span-4 max-[760px]:col-span-2'
}

function projectResponsiveLayout(
  index: number,
  project: (typeof projects)[number],
): string {
  if (project.compact) return 'compact'
  if (project.portrait) return 'portrait'
  if (project.wide) return 'wide'
  if ((index + 1) % 4 === 0) return 'offset'
  if ((index + 1) % 3 === 0) return 'half'
  return 'default'
}

function ProjectCard({
  Media,
  index,
  project,
}: {
  Media: ComponentType<ProjectMediaProps>
  index: number
  project: (typeof projects)[number]
}) {
  const projectRef = useScrollReveal<HTMLElement>()
  const motionStyle = {
    '--project-delay': `${(index % 3) * 65}ms`,
    '--project-drift': `${index % 2 === 0 ? 18 : -18}px`,
  } as CSSProperties

  const href = project.url

  return (
    <article
      className={`project group ${projectLayout(index, project)} ${href ? 'cursor-pointer' : ''}`}
      data-layout={projectResponsiveLayout(index, project)}
      data-scroll-reveal
      ref={projectRef}
      style={motionStyle}
      onClick={href ? () => window.open(href, '_blank', 'noreferrer') : undefined}
      role={href ? 'link' : undefined}
      tabIndex={href ? 0 : undefined}
      onKeyDown={href ? (e: React.KeyboardEvent) => { if (e.key === 'Enter') window.open(href, '_blank', 'noreferrer') } : undefined}
    >
      <div className="project-media relative overflow-hidden bg-[#111]">
        <Media
          image={project.image}
          hoverImage={project.hover}
          effect={project.effect}
        />
        {!['Samsung Prism', 'NextTechLab', 'Manic'].includes(project.name) && (
          <span className="absolute top-0 right-0 z-[2] bg-[#e05035] px-[7px] py-[5px] font-mono text-[10px]/none text-[#141314] uppercase">Selected project</span>
        )}
      </div>
      <div className="project-meta flex items-center justify-between pt-3 font-mono text-[12px]/[1.2] uppercase max-[760px]:text-[9px]/[1.4]">
        <h3 className="m-0 font-[inherit]">{project.name}</h3>
        {project.url && (
          <a className="inline-flex items-center gap-1 bg-white px-2 py-0.5 text-[10px]/none no-underline" style={{ color: '#141314' }} href={project.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            OPEN <span className="text-[11px]">→</span>
          </a>
        )}
      </div>
    </article>
  )
}

export function ProjectsSection({ Media }: ProjectsSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      className="projects relative z-[1] grid grid-cols-12 gap-x-4 gap-y-[clamp(38px,8vw,130px)] px-[4vw] pt-[10vh] pb-[22vh] max-[760px]:grid-cols-2 max-[760px]:gap-x-[10px] max-[760px]:gap-y-[60px] max-[760px]:px-[18px] max-[760px]:pt-[5vh] max-[760px]:pb-[18vh]"
      id="work"
      aria-label="Selected work"
      data-dot-transition-end
      data-scroll-reveal
      ref={sectionRef}
    >
      {projects.map((project, index) => (
        <ProjectCard
          Media={Media}
          index={index}
          key={project.name}
          project={project}
        />
      ))}
    </section>
  )
}
