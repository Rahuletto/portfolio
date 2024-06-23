import { useDevice } from "@/provider/DeviceProvider";
import { ReactNode } from "react";

interface SlidesProps {
  children: ReactNode;
  id: string;
}

export default function Scroller({ children, id }: SlidesProps) {
  const device = useDevice();
  return (
    <section
      id={id}
      className="outline-none relative snap-center md:p-6 p-6 rounded-xl overflow-hidden"
      style={{ height: device == "mobile" ? "100vh" : "calc(100vh - 96px)" }}
    >
      {children}
    </section>
  );
}
