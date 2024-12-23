import * as React from "react";
import { tw } from "../../twind/twind.ts";

interface BeanSVGProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const BeanSVG: React.FC<BeanSVGProps> = ({ className, ...props }) => (
  <svg
  width={"1em"}
    height={"1em"}
    viewBox="0 0 77 152"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={tw(className || "")}
    {...props}
  >
    <rect
      width={76.3574}
      height={152}
      rx={38.1787}
      fill="currentColor"
    />
  </svg>
);

export default BeanSVG;
