import { type ReactNode } from "react";
import { type ThemeColor } from "./theme";

export interface ChildrenProps {
  children?: ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export interface FullProps extends ChildrenProps, ClassNameProps {}

export interface RainbowStringsProps extends FullProps {
  onColorClick?: (color: ThemeColor) => void;
}
