import { type Transition } from 'motion/react';

export interface MotionTextProps {
  text: string | string[];
  delay?: number;
  stagger?: number;
  className?: string;
  wordClassName?: string;
  transition?: Transition;
}

export type MarqueeItem =
  | { type: 'text'; content: string }
  | { type: 'icon'; src: string };
