export type Project = {
  name: string
  title?: string
  description?: string
  stats?: string[] | string
  image: string
  hover: string
  effect: number
  url?: string
  wide?: boolean
  compact?: boolean
  portrait?: boolean
}

export const projects: Project[] = [
  {
    name: 'Lavalamp',
    title: 'Lavalamp',
    description: 'A local AI coding agent with precise edits, parallel subagents, and complete control over every action it takes.',
    image: 'lavalamp.png',
    hover: 'lavalamp-2.png',
    effect: 1,
    url: 'https://lavalamp.marban.lol',
    wide: true,
  },
  {
    name: 'Samsung Prism',
    title: 'Samsung PRISM',
    description: 'Worked with a four-member research team to develop and optimize applied AI solutions as part of Samsung’s industry-led research program.',
    image: 'prism.png',
    hover: 'prism.png',
    effect: 1,
  },
  {
    name: 'NextTechLab',
    title: 'Next Tech Lab',
    description: 'Board member at a student-led research lab where ambitious ideas across AI, robotics, extended reality, blockchain, and human-computer interaction become research, projects, and products.',
    image: 'ntl.png',
    hover: 'ntl-2.png',
    effect: 2,
    url: 'https://nexttechlab.in',
  },
  {
    name: 'Bullet',
    title: 'Bullet',
    description: 'A browser-native security engine that turns live web applications into ranked findings, attack surfaces, and connected attack chains.',
    image: 'bullet.png',
    hover: 'bullet.png',
    effect: 3,
    url: 'https://github.com/rahuletto/bullet',
    compact: true,
  },
  {
    name: 'Rocket',
    title: 'Rocket',
    description: 'A fast, lightweight native code editor with language-server intelligence and an integrated Codex agent.',
    image: 'rocket.png',
    hover: 'rocket-2.png',
    effect: 0,
    url: 'https://github.com/rahuletto/rocket',
  },
  {
    name: 'Manic',
    title: 'Manic',
    description: 'A Bun-native React framework built for near-instant development, compact builds, and AI-native applications.',
    image: 'manic.png',
    hover: 'manic-2.png',
    effect: 2,
    url: 'https://manicjs.tech',
    portrait: true,
  },
  {
    name: 'Mandy',
    title: 'Mandy',
    description: 'A modern API workspace that unifies testing, documentation, environments, and automated request workflows.',
    image: 'mandy.png',
    hover: 'mandy-2.png',
    effect: 0,
    url: 'https://github.com/rahuletto/mandy',
  },
]
