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

const quantityPattern = /(\d+(?:\.\d+)?[KMBX]?\+?)/gi
const quantityTokenPattern = /^\d+(?:\.\d+)?[KMBX]?\+?$/i

function ProjectDescription({ description }: { description: string }) {
  return description.split(quantityPattern).map((part, index) => (
    quantityTokenPattern.test(part)
      ? <strong className="font-bold text-[#e05035]" key={`${part}-${index}`}>{part}</strong>
      : part
  ))
}

function projectLayout(
  _index: number,
  project: (typeof projects)[number],
): string {
  switch (project.name) {
    case 'ClassPro':
      return 'col-start-7 col-span-5 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'SimplyDJS':
      return 'col-start-1 col-span-7 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'Lavalamp':
      return 'col-start-5 col-span-6 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'Samsung Prism':
      return 'col-start-1 col-span-5 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'NextTechLab':
      return 'col-start-2 col-span-6 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'Bullet':
      return 'col-start-6 col-span-6 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'Rocket':
      return 'col-start-1 col-span-6 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'Manic':
      return 'col-start-2 col-span-5 max-[760px]:col-start-auto max-[760px]:col-span-2'
    case 'Mandy':
      return 'col-start-4 col-span-7 max-[760px]:col-start-auto max-[760px]:col-span-2'
    default:
      return 'col-span-6 max-[760px]:col-span-2'
  }
}

function projectResponsiveLayout(
  index: number,
  project: (typeof projects)[number],
): string {
  if (project.portrait) return 'portrait'
  if (project.wide) return 'wide'
  if ((index + 1) % 2 === 0) return 'offset'
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
  const projectRef = useScrollReveal<HTMLElement>(undefined, true)
  const motionStyle = {
    '--project-delay': `${(index % 3) * 65}ms`,
    '--project-drift': `${index % 2 === 0 ? 18 : -18}px`,
  } as CSSProperties

  const href = project.url

  return (
    <article
      className={`project group ${projectLayout(index, project)}`}
      data-layout={projectResponsiveLayout(index, project)}
      data-scroll-reveal
      ref={projectRef}
      style={motionStyle}
    >
      {href ? (
        <a className="block rounded-2xl focus-visible:outline-offset-8 max-[760px]:rounded-xl" href={href} target="_blank" rel="noreferrer">
          <div className="project-media relative overflow-hidden rounded-2xl bg-[#111] max-[760px]:rounded-xl">
            <Media image={project.image} hoverImage={project.hover} effect={project.effect} />
          </div>
          <div className="project-meta flex items-start justify-between gap-6 pt-4 max-[760px]:gap-3 max-[760px]:pt-3">
            <div className="min-w-0 flex flex-1 flex-col gap-1.5">
              <h3 className="m-0 text-[clamp(18px,1.6vw,24px)] font-bold leading-tight tracking-tight text-white max-[760px]:text-[16px]">
                {project.title || project.name}
              </h3>
              {project.description && (
                <p className="m-0 break-words text-[clamp(14px,1.15vw,16px)] font-normal leading-relaxed text-zinc-300 max-[760px]:text-[14px] max-[760px]:leading-normal">
                  <ProjectDescription description={project.description} />
                </p>
              )}
            </div>
            <span aria-hidden="true" className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#141314] transition-all duration-200 group-hover:scale-105 group-focus-within:scale-105">
              OPEN <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5">→</span>
            </span>
            <span className="sr-only">Opens in a new tab</span>
          </div>
        </a>
      ) : (
        <>
          <div className="project-media relative overflow-hidden rounded-2xl bg-[#111] max-[760px]:rounded-xl">
            <Media image={project.image} hoverImage={project.hover} effect={project.effect} />
          </div>
          <div className="project-meta pt-4 max-[760px]:pt-3">
            <h3 className="m-0 text-[clamp(18px,1.6vw,24px)] font-bold leading-tight tracking-tight text-white max-[760px]:text-[16px]">
              {project.title || project.name}
            </h3>
            {project.description && (
              <p className="m-0 mt-1.5 break-words text-[clamp(14px,1.15vw,16px)] font-normal leading-relaxed text-zinc-300 max-[760px]:text-[14px] max-[760px]:leading-normal">
                <ProjectDescription description={project.description} />
              </p>
            )}
          </div>
        </>
      )}
    </article>
  )
}

export function ProjectsSection({ Media }: ProjectsSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section
      className="projects relative z-[1] grid grid-cols-12 gap-x-[clamp(24px,3.5vw,56px)] gap-y-[clamp(60px,10vw,160px)] px-[5vw] pt-[10vh] pb-[22vh] max-[760px]:grid-cols-2 max-[760px]:gap-x-4 max-[760px]:gap-y-16 max-[760px]:px-[18px] max-[760px]:pt-[5vh] max-[760px]:pb-[18vh]"
      id="work"
      aria-labelledby="projects-heading"
      data-dot-transition-end
      data-scroll-reveal
      ref={sectionRef}
    >
      <h2 className="sr-only" id="projects-heading">Selected work</h2>
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
