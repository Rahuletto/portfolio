import { type MarqueeItem } from "@/types/ui";

export const MOBILE_QUERY = typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)") : null;

export const RAINBOW_MAP = {
  purple: "#a860ff",
  blurple: "#575fff",
  blue: "#57beff",
  green: "#84ff57",
  yellow: "#ffd557",
  orange: "#ff7057",
  red: "#ff5757",
} as const;

export const ASSETS = {
  MASCOTS: {
    HERO: {
      IDLE: "/assets/mascots/hero/idle.svg",
      WAVE: "/assets/mascots/hero/wave.svg",
      SURPRISED: "/assets/mascots/hero/surprised.svg",
    },
  },
  ICONS: {
    ME: "/assets/icons/me.svg",
    SPANNER: "/assets/icons/spanner.svg",
    CURSOR: "/assets/icons/cursor.svg",
  },
} as const;

export const TIMES = {
  WAVE_MIN_DELAY: 5000,
  WAVE_MAX_DELAY: 7000,
  WAVE_DURATION: 2500,
} as const;

export const NAV_ITEMS = [
  {
    id: "developer",
    label: "Works",
    icon: ASSETS.ICONS.SPANNER,
    alt: "Works",
  },
  {
    id: "hero",
    label: "Me",
    icon: ASSETS.ICONS.ME,
    alt: "Me",
  },
  {
    id: "resume",
    label: "Download Resume",
    icon: "/assets/icons/star.svg",
    alt: "Download Resume",
  },
] as const;

export const MARQUEE_ITEMS: MarqueeItem[] = [
  { type: "text", content: "DESIGNER" },
  { type: "icon", src: ASSETS.ICONS.ME },
  { type: "text", content: "DEVELOPER" },
  { type: "icon", src: ASSETS.ICONS.SPANNER },
];

export const MARQUEE_REPEATS = 6;
export const MARQUEE_SPEED = 1.5;
export const MARQUEE_MAX_SPEED = 40;
export const MARQUEE_GAP = 34;
export const MARQUEE_SCROLL_SCALE = 0.3;
export const MARQUEE_LERP = 0.03;
export const MARQUEE_STRETCH = "200%";
export const WORK_CARD_DIR_MAP = {
  left: -100,
  center: 0,
  right: 100
} as const;

export const WORK_CARD_ORIGIN_MAP = {
  left: "origin-bottom-left",
  center: "origin-bottom",
  right: "origin-bottom-right"
} as const;

export const WORK_CARD_TYPE_MAP = {
  long: "row-span-2 col-span-1 aspect-[324/488]",
  short: "row-span-1 col-span-1 aspect-[324/236]",
} as const;

export const WORK_CARD_VIEWPORT = { once: true, amount: 0.2, margin: "10000px 0px -5% 0px" } as const;
export const WORK_CARD_TRANSITION = { duration: 1.4, ease: [0.16, 1, 0.3, 1] } as const;
export const WORKS_HEADER_TRANSITION = { duration: 1.2, ease: [0.16, 1, 0.3, 1] } as const;
export const WORKS_LINE_TRANSITION = { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 } as const;
export const WORK_CARDS = [
  { image: "/assets/works/unix.webp?v=2", type: "short" as const },
  { image: "/assets/works/mandy.webp?v=2", type: "long" as const },
  { image: "/assets/works/simplydjs.webp?v=2", type: "long" as const },
  { image: "/assets/works/classpro.webp?v=2", type: "long" as const },
  { image: "/assets/works/rocket.webp?v=2", type: "short" as const },
  { image: "/assets/works/Manic.webp?v=2", type: "short" as const },
  { image: "/assets/works/NTL.webp?v=2", type: "short" as const },
  { image: "/assets/works/prism.webp?v=2", type: "short" as const },
  { image: "/assets/works/ami.webp?v=2", type: "long" as const },
  { image: "/assets/works/dreamnity.webp?v=2", type: "short" as const },
] as const;
