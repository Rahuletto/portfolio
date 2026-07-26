export type Project = {
  name: string
  image: string
  hover: string
  effect: number
  url?: string
  wide?: boolean
  compact?: boolean
  portrait?: boolean
}

export const projects: Project[] = [
  { name: 'Rocket', image: 'rocket.png', hover: 'rocket-2.png', effect: 0, url: 'https://github.com/rahuletto/rocket', wide: true },
  { name: 'Samsung Prism', image: 'prism.png', hover: 'prism.png', effect: 1 },
  { name: 'NextTechLab', image: 'ntl.png', hover: 'ntl-2.png', effect: 2, url: 'https://nexttechlab.in' },
  { name: 'Bullet', image: 'bullet.png', hover: 'bullet.png', effect: 3, compact: true },
  { name: 'Lavalamp', image: 'lavalamp.png', hover: 'lavalamp-2.png', effect: 1, url: 'https://lavalamp.marban.lol' },
  { name: 'Manic', image: 'manic.png', hover: 'manic-2.png', effect: 2, url: 'https://manicjs.tech', portrait: true },
  { name: 'Mandy', image: 'mandy.png', hover: 'mandy-2.png', effect: 0, url: 'https://github.com/rahuletto/mandy' },
]
