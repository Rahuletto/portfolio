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
  if (project.wide) return 'col-start-5 col-span-8 max-[760px]:col-start-auto max-[760px]:col-span-2'
  if ((index + 1) % 4 === 0) return 'col-start-7 col-span-4 max-[760px]:col-start-auto max-[760px]:col-span-2'
  if ((index + 1) % 3 === 0) return 'col-start-2 col-span-5 max-[760px]:col-start-auto max-[760px]:col-span-1'
  return 'col-span-6 max-[760px]:col-span-2'
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

  return (
    <article
      className={`project group ${projectLayout(index, project)} ${project.compact ? 'project--compact' : ''} ${project.portrait ? 'project--portrait' : ''}`}
      data-layout={projectResponsiveLayout(index, project)}
      data-scroll-reveal
      ref={projectRef}
      style={motionStyle}
    >
      <div className="project-media relative overflow-hidden bg-[#111]">
        <Media
          image={project.image}
          hoverImage={project.hover}
          effect={project.effect}
        />
        {project.name !== 'Product experiences' && (
          <span className="absolute top-0 right-0 z-[2] bg-[#e05035] px-[7px] py-[5px] font-mono text-[10px]/none text-[#141314] uppercase">Selected project</span>
        )}
      </div>
      <div className="project-meta flex justify-between gap-[18px] pt-3 font-mono text-[12px]/[1.2] uppercase max-[760px]:block max-[760px]:text-[9px]/[1.4]">
        <h3 className="m-0 font-[inherit]">{project.name}</h3>
        <p className="m-0 whitespace-nowrap text-[#8e93a0] max-[760px]:mt-[3px]">{project.year}</p>
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
