import { ReactNode } from "react";

interface SlidesProps {
  children: ReactNode;
  id: string;
}

export default function Scroller({ children, id }: SlidesProps) {
  return (
    <section
      id={id}
      className="outline-none relative snap-center p-6 rounded-xl overflow-hidden"
      style={{ height: "calc(100vh - 64px)", maxWidth: "calc(100vw - 42px)" }}
    >
      {children}
    </section>
  );
};
