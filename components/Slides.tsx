import { useDevice } from "@/provider/DeviceProvider";
import { ReactNode } from "react";

interface SlidesProps {
  children: ReactNode;
  id: string;
  noanim?: boolean;
}

export default function Scroller({ children, id, noanim }: SlidesProps) {
  const device = useDevice();
  const st = noanim ? {
    height: '91vh'
  } : {}
  return (
    <section
      id={id}
      className="outline-none relative snap-center md:p-6 p-5 px-8 rounded-xl overflow-hidden"
      style={{ height: device == "mobile" ? "96vh" : "calc(100vh - 94px)", ...st }}
    >
      {children}
    </section>
  );
}
