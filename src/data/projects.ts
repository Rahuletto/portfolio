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
    name: 'ClassPro',
    title: 'ClassPro',
    description: 'An academic dashboard used by 30K monthly users and handling more than 2M visits each month.',
    image: 'classpro.webp',
    hover: 'classpro-2.webp',
    effect: 2,
    url: 'https://github.com/suduolabs/ClassPro',
    portrait: true,
  },
  {
    name: 'SimplyDJS',
    title: 'SimplyDJS',
    description: 'A Discord.js utility library maintained for three years and downloaded more than 600K times annually.',
    image: 'simplydjs.webp',
    hover: 'simplydjs-2.webp',
    effect: 1,
    url: 'https://github.com/Rahuletto/simply-djs',
    wide: true,
  },
  {
    name: 'Lavalamp',
    title: 'Lavalamp',
    description: 'A local coding agent with file editing, parallel subagents, and explicit control over its actions.',
    image: 'lavalamp.webp',
    hover: 'lavalamp-2.webp',
    effect: 1,
    url: 'https://lavalamp.marban.lol',
    wide: true,
  },
  {
    name: 'Samsung Prism',
    title: 'Samsung PRISM',
    description: 'Applied AI research completed with a four-person team through Samsung’s PRISM program.',
    image: 'prism.webp',
    hover: 'prism-2.webp',
    effect: 1,
  },
  {
    name: 'NextTechLab',
    title: 'Next Tech Lab',
    description: 'Board member at a QS-certified student research lab working across AI, robotics, extended reality, blockchain, and HCI.',
    image: 'ntl.webp',
    hover: 'ntl-2.webp',
    effect: 2,
    url: 'https://nexttechlab.in',
  },
  {
    name: 'Bullet',
    title: 'Bullet',
    description: 'A browser-based security tool for mapping routes, APIs, findings, and attack paths in live web applications.',
    image: 'bullet.webp',
    hover: 'bullet-2.webp',
    effect: 3,
    url: 'https://github.com/rahuletto/bullet',
    compact: true,
  },
  {
    name: 'Rocket',
    title: 'Rocket',
    description: 'An agentic code editor with language-server support and an integrated Codex workflow.',
    image: 'rocket.webp',
    hover: 'rocket-2.webp',
    effect: 0,
    url: 'https://github.com/rahuletto/rocket',
  },
  {
    name: 'Manic',
    title: 'Manic',
    description: 'The fastest framework on the planet, reaching up to 42x the speed of Next.js.',
    image: 'manic.webp',
    hover: 'manic-2.webp',
    effect: 2,
    url: 'https://manicjs.tech',
    portrait: true,
  },
  {
    name: 'Mandy',
    title: 'Mandy',
    description: 'An API client for organizing requests, environments, documentation, and automated workflows.',
    image: 'mandy.webp',
    hover: 'mandy-2.webp',
    effect: 0,
    url: 'https://github.com/rahuletto/mandy',
  },
]
