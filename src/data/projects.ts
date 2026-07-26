export type Project = {
  name: string
  year: string
  image: string
  hover: string
  effect: number
  wide?: boolean
  compact?: boolean
  portrait?: boolean
}

export const projects: Project[] = [
  { name: 'Agentic AI systems', year: 'Selected work', image: '013-reunimos01.png', hover: '026-reunimos02.png', effect: 0, wide: true },
  { name: 'Interface systems', year: 'UI / UX', image: '014-inspire_mono_01.png', hover: '028-inspire_mono_02.png', effect: 1 },
  { name: 'Developer tools', year: 'Full-stack', image: '015-wasm01.png', hover: '028-wasm02.png', effect: 2 },
  { name: 'Design utilities', year: 'Tools ↗', image: '014-si.png', hover: '033-si02.png', effect: 3, compact: true },
  { name: 'AI operators', year: 'Automation ↗', image: '016-ds01.png', hover: '030-ds02.png', effect: 1 },
  { name: 'Product experiences', year: 'Web / Mobile', image: '018-ali01.png', hover: '031-ali02.png', effect: 2, portrait: true },
  { name: 'Visual systems', year: 'Design', image: '018-sd01.png', hover: '032-sd02.png', effect: 0 },
  { name: 'Product engineering', year: 'Build', image: '019-c4.png', hover: '019-c4.png', effect: 3 },
  { name: 'Interaction studies', year: 'Experiments ↗', image: '015-s01.png', hover: '033-s02.png', effect: 1 },
]
