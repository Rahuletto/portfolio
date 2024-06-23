import { ReactNode } from "react";

interface SlidesProps {
  children: ReactNode;
  id: string;
}

export default function Scroller({ children, id }: SlidesProps) {

  return (
    <section
      id={id}
      className="outline-none relative snap-center md:p-6 p-3 rounded-xl overflow-hidden"
      style={{ height: "calc(100vh - 96px)"}}
    >
      {children}
    </section>
  );
};
