import * as React from "react";
import { tw } from "../../twind/twind.ts";

interface StarSVGProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const StarSVG: React.FC<StarSVGProps> = ({ className, ...props }) => (
  <svg
    width={"1em"}
    height={"1em"}
    viewBox="0 0 84 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={tw(className || "")}
    {...props}
  >
    <path
      d="M42 0C42 23.196 60.804 42 84 42C60.804 42 42 60.804 42 84C42 60.804 23.196 42 0 42C23.196 42 42 23.196 42 0Z"
      fill="currentColor"
    />
  </svg>
);

export default StarSVG;
