import { useEffect, useRef, useState, type FC } from 'react'
import {
  AnimatePresence,
  cubicBezier,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import NumberFlow from '@number-flow/react'

const skillsData = [
  {
    type: 'Languages',
    items: [
      'TypeScript',
      'JavaScript',
      'Python',
      'Go',
      'Rust',
      'C',
      'Java',
      'Swift',
      'SQL',
    ],
  },
  {
    type: 'Frontend',
    items: [
      'React',
      'Next.js',
      'Astro',
      'SolidJS',
      'React Native',
      'Tailwind CSS',
      'Framer Motion',
      'Manic',
      'Figma',
    ],
  },
  {
    type: 'Backend',
    items: [
      'Node.js',
      'Bun',
      'Deno',
      'Hono',
      'ElysiaJS',
      'Express',
      'FastAPI',
      'Django',
      'Fiber',
      'WebSockets',
    ],
  },
  {
    type: 'AI',
    items: [
      'Multi-agent systems',
      'Code intelligence',
      'RAG',
      'Knowledge graphs',
      'LangGraph',
      'Vercel AI SDK',
      'PyTorch',
      'YOLO',
    ],
  },
  {
    type: 'Developer Tools',
    items: [
      'Tauri',
      'Electron',
      'OXC',
      'CLI tooling',
      'Build systems',
      'Git',
    ],
  },
  {
    type: 'Data and Infrastructure',
    items: [
      'PostgreSQL',
      'MongoDB',
      'Supabase',
      'Cloudflare D1',
      'Cloudflare Workers',
      'Vercel',
      'Docker',
      'Podman',
      'GitHub Actions',
    ],
  },
  {
    type: 'Security Engineering',
    items: [
      'Reconnaissance pipelines',
      'JavaScript analysis',
      'API discovery',
      'Vulnerability validation',
      'Attack-chain reasoning',
	   'BurpSuite',
      'Nuclei',
      'BBOT',
    ],
  },
]

const statsGroupMap: Record<
  number,
  {
    m1: { val: number; label: string; compact: boolean; suffix: string }
    m2: { val: number; label: string; compact: boolean; suffix: string }
  }
> = {
  // Set 1: Languages [0], Frontend [1]
  0: {
    m1: { val: 60, label: 'open-source projects', compact: false, suffix: '+' },
    m2: { val: 340, label: 'github stars', compact: false, suffix: '+' },
  },
  1: {
    m1: { val: 60, label: 'open-source projects', compact: false, suffix: '+' },
    m2: { val: 340, label: 'github stars', compact: false, suffix: '+' },
  },
  // Set 2: Backend [2], AI [3], Developer Tools [4]
  2: {
    m1: { val: 2000000, label: 'visits per month', compact: true, suffix: '+' },
    m2: { val: 30000, label: 'monthly active users', compact: true, suffix: '+' },
  },
  3: {
    m1: { val: 2000000, label: 'visits per month', compact: true, suffix: '+' },
    m2: { val: 30000, label: 'monthly active users', compact: true, suffix: '+' },
  },
  4: {
    m1: { val: 2000000, label: 'visits per month', compact: true, suffix: '+' },
    m2: { val: 30000, label: 'monthly active users', compact: true, suffix: '+' },
  },
  // Set 3: Data and Infrastructure [5], Security Engineering [6]
  5: {
    m1: { val: 80000, label: 'daily visits', compact: true, suffix: '+' },
    m2: { val: 10000, label: 'daily users', compact: true, suffix: '+' },
  },
  6: {
    m1: { val: 80000, label: 'daily visits', compact: true, suffix: '+' },
    m2: { val: 10000, label: 'daily users', compact: true, suffix: '+' },
  },
}

const SkillItem: FC<{
  item: string
  isMobile: boolean
  reducedMotion: boolean
}> = ({ item, isMobile, reducedMotion }) => {
  const ref = useRef<HTMLLIElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isMobile ? ['start 96vh', 'start 40vh'] : ['start 96vh', 'start 48vh'],
  })

  const startX = isMobile ? 44 : 140

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [startX, 0],
    {
      ease: cubicBezier(0.645, 0.045, 0.355, 1),
    },
  )

  const mobileOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.7, 1],
    [0, 1, 1, 0],
  )
  const desktopOpacity = useTransform(scrollYProgress, [0, 0.22, 1], [0, 0.75, 1])
  const opacity = isMobile ? mobileOpacity : desktopOpacity

  return (
    <motion.li
      ref={ref}
      style={reducedMotion ? undefined : { x, opacity }}
      className="w-fit text-[clamp(22px,3vw,40px)] font-semibold leading-snug tracking-tight text-white transition-colors duration-200 hover:text-[#e05035]"
    >
      {item}
    </motion.li>
  )
}

export function SkillsSection() {
  const [currentSection, setCurrentSection] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)
  const reducedMotion = useReducedMotion() ?? false
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const numRef = useRef<HTMLDivElement>(null)
  const numInView = useInView(numRef, { once: false, margin: '-10% 0px -10% 0px' })

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    let frame = 0

    const updateActiveSection = () => {
      frame = 0
      const viewportHeight = window.innerHeight
      const bandTop = viewportHeight * (isMobile ? 0.45 : 0.18)
      const bandBottom = viewportHeight * (isMobile ? 0.82 : 0.78)
      const bandCenter = (bandTop + bandBottom) * 0.5
      let activeIndex = 0
      let largestOverlap = 0
      let nearestDistance = Infinity

      for (let index = 0; index < sectionRefs.current.length; index += 1) {
        const section = sectionRefs.current[index]
        if (!section) continue

        const rect = section.getBoundingClientRect()
        const overlap = Math.max(
          0,
          Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop),
        )
        if (overlap > largestOverlap) {
          largestOverlap = overlap
          activeIndex = index
        } else if (largestOverlap === 0 && overlap === 0) {
          const distance = Math.abs((rect.top + rect.bottom) * 0.5 - bandCenter)
          if (distance < nearestDistance) {
            nearestDistance = distance
            activeIndex = index
          }
        }
      }

      setCurrentSection((previous) => (
        previous === activeIndex ? previous : activeIndex
      ))
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(updateActiveSection)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('portfolio:scroll', scheduleUpdate)
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    updateActiveSection()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('portfolio:scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [isMobile])

  const activeGroup = statsGroupMap[currentSection] || statsGroupMap[0]

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      data-dot-transition-vanish
      className="skills-section relative z-[1] mx-auto flex min-h-[100lvh] w-full max-w-[1440px] flex-col justify-between gap-10 px-[5vw] py-[10vh] md:flex-row md:items-start md:gap-[10vw] lg:gap-[12vw] max-[760px]:px-5 max-[760px]:py-10"
    >
      {/* Sticky Left Column */}
      <div className="sticky top-20 z-30 flex min-w-[36%] flex-col justify-between bg-transparent max-md:w-full md:h-[80lvh] md:min-h-[480px]">
        <div>
          <h2 id="skills-heading" className="mb-2 text-lg font-semibold text-[#fefefe]/60 max-[760px]:text-base">Skills</h2>

          {reducedMotion ? (
            <h3 aria-hidden="true" className="mb-4 inline-block text-[clamp(28px,3.5vw,52px)] font-bold leading-none tracking-tight text-[#fefefe] md:whitespace-nowrap">
              {skillsData[currentSection]?.type || 'Skills Overview'}
            </h3>
          ) : (
            <AnimatePresence mode="wait">
              <motion.h3
                aria-hidden="true"
                key={currentSection}
                initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
                transition={{
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-4 inline-block text-[clamp(28px,3.5vw,52px)] font-bold leading-none tracking-tight text-[#fefefe] md:whitespace-nowrap"
              >
                {skillsData[currentSection]?.type || 'Skills Overview'}
              </motion.h3>
            </AnimatePresence>
          )}

          <p className="max-w-[440px] text-[clamp(15px,1.25vw,20px)] leading-relaxed text-[#fefefe]/85 max-[760px]:text-sm">
            Engineering web products, AI systems, developer tools, and high-performance infrastructure.
          </p>
        </div>

        {/* Stats Container (Desktop & Mobile) */}
        <div className="mt-auto pt-4 flex flex-col gap-2 max-md:mt-6" ref={numRef}>
          <div className="grid grid-cols-2 gap-4 pt-1 max-[400px]:grid-cols-1">
            <div className="min-w-0">
              {reducedMotion ? (
                <span className="text-[clamp(44px,5vw,76px)] font-bold leading-none tracking-tight text-[#fefefe]">
                  {new Intl.NumberFormat('en', activeGroup.m1.compact ? { compactDisplay: 'short', notation: 'compact' } : undefined).format(activeGroup.m1.val)}{activeGroup.m1.suffix}
                </span>
              ) : (
                <NumberFlow
                  value={numInView ? activeGroup.m1.val : 0}
                  className="text-[clamp(44px,5vw,76px)] font-bold leading-none tracking-tight text-[#fefefe]"
                  format={activeGroup.m1.compact ? { compactDisplay: 'short', notation: 'compact' } : undefined}
                  suffix={activeGroup.m1.suffix}
                />
              )}
              <p className="-mt-1 text-[clamp(14px,1.2vw,18px)] font-medium leading-tight text-[#fefefe]/85">
                {activeGroup.m1.label}
              </p>
            </div>

            <div className="min-w-0">
              {reducedMotion ? (
                <span className="text-[clamp(44px,5vw,76px)] font-bold leading-none tracking-tight text-[#fefefe]">
                  {new Intl.NumberFormat('en', activeGroup.m2.compact ? { compactDisplay: 'short', notation: 'compact' } : undefined).format(activeGroup.m2.val)}{activeGroup.m2.suffix}
                </span>
              ) : (
                <NumberFlow
                  value={numInView ? activeGroup.m2.val : 0}
                  className="text-[clamp(44px,5vw,76px)] font-bold leading-none tracking-tight text-[#fefefe]"
                  format={activeGroup.m2.compact ? { compactDisplay: 'short', notation: 'compact' } : undefined}
                  suffix={activeGroup.m2.suffix}
                />
              )}
              <p className="-mt-1 text-[clamp(14px,1.2vw,18px)] font-medium leading-tight text-[#fefefe]/85">
                {activeGroup.m2.label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column Skills Items List */}
      <div className="w-full min-w-[45%] pb-16 md:pb-40">
        {skillsData.map((section, sectionIndex) => (
          <section
            key={section.type}
            aria-labelledby={`skill-group-${sectionIndex}`}
            ref={(el) => {
              sectionRefs.current[sectionIndex] = el
            }}
            className={`mt-10 flex flex-col gap-4 pb-12 w-full max-md:mt-6 max-md:pb-8 ${
              sectionIndex !== skillsData.length - 1 ? 'border-b border-white/10' : ''
            }`}
          >
            <h3 className="sr-only" id={`skill-group-${sectionIndex}`}>{section.type}</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 md:gap-3.5">
              {section.items.map((item, itemIndex) => (
                <SkillItem
                  key={`${sectionIndex}-${itemIndex}`}
                  item={item}
                  isMobile={isMobile}
                  reducedMotion={reducedMotion}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
