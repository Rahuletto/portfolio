export enum WorkCardType {
  LONG = "long",
  SHORT = "short",
}

export enum WorkCardDir {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export interface WorkCardProps {
  image: string;
  delay?: number;
  type?: WorkCardType | "long" | "short";
  dir?: WorkCardDir | "left" | "center" | "right";
  className?: string;
}
