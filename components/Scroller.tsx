import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDevice } from "@/provider/DeviceProvider";

interface ScrollerProps {
  children: ReactNode;
}

export default function Scroller({ children }: ScrollerProps) {
  const device = useDevice();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const menu_links = document.querySelectorAll("#scrollLink");

    const sections = document.querySelectorAll("section");

    const makeActive = (link: string) => {
      const active = Array.from(menu_links).find((a) =>
        a.getAttribute("href")?.includes(link)
      );

      active?.classList.add("active");
    };
    const removeActive = (link: number) =>
      menu_links[link] && menu_links[link]?.classList?.remove("active");

    const removeAllActive = () =>
      [...Array(sections.length).keys()].forEach((link) => removeActive(link));

    const sectionMargin = 100;

    let currentActive = "me";

    function navActive() {
      if (!container) return;
      const newScroll = container.scrollTop;

      const pos =
        sections.length -
        [...sections]
          .reverse()
          .findIndex(
            (section) => newScroll >= section.offsetTop - sectionMargin
          ) -
        1;

      const current = sections[pos]?.id;

      if (current !== currentActive) {
        removeAllActive();
        currentActive = current;
        makeActive(current);
      }
    }

    function movePages(e: KeyboardEvent) {
      if (!container) return;
      const pos =
        sections.length -
        [...sections]
          .reverse()
          .findIndex(
            (section) =>
              container.scrollTop >= section.offsetTop - sectionMargin
          ) -
        1;

      const firstSection = sections[0];
      const lastSection = sections[sections.length - 1];

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        if (pos === 0) {
          lastSection?.scrollIntoView({ behavior: "instant" });
          setTimeout(() => {
            sections[pos - 2]?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else container.scrollTop += container.clientHeight;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        if (pos === sections.length - 1) {
          firstSection?.scrollIntoView({ behavior: "instant" });
          setTimeout(() => {
            sections[1]?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        } else container.scrollTop -= container.clientHeight;
      }
    }

    const updateScale = () => {
      if (container) {
        const height = container.clientHeight;
        container.style.maxWidth = `${(16 / 9) * height}px`;
      }
    };

    container?.addEventListener("scroll", navActive, { passive: true });
    window.addEventListener("keydown", movePages);
    window.addEventListener("resize", updateScale);
    updateScale();

    return () => {
      window.removeEventListener("resize", updateScale);
      container?.removeEventListener("scroll", navActive);
      window.removeEventListener("keydown", movePages);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="container"
      style={{
        width: device === "mobile" ? "100%" : "calc(100% - 32px)",
        height: device === "mobile" ? "100%" : "calc(100% - 72px)",
      }}
      className="outline-none max-w-[1670px] md:border-2 md:border-border rounded-3xl flex touch-manipulation fixed md:w-[calc(100% - 32px)] w-[calc(100% - 16px)] flex-col overflow-y-scroll snap-y snap-mandatory md:bg-container"
    >
      {
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: false }}
          className="flex gap-2 flex-col p-0"
        >
          {children}
        </motion.div>
      }
    </div>
  );
}
