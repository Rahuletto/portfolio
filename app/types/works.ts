export interface WorkCardProps {
  image: string;
  delay?: number;
  type?: 'long' | 'short';
  dir?: 'left' | 'center' | 'right';
  className?: string;
  index: number;
}
