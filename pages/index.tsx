import Navbar from "@/components/Navbar";
import Scroller from "@/components/Scroller";
import About from "@/components/slides/About";
import Connect from "@/components/slides/Connect";
import Hero from "@/components/slides/Hero";
import Journey from "@/components/slides/Journey";
import Work from "@/components/slides/Work";
import { useDevice } from "@/provider/DeviceProvider";
import Head from "next/head";

import { useEffect, useRef } from "react";

export default function Home() {
  const device = useDevice();
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const menu_links = document.querySelectorAll("#scrollLink");
    const container = document.querySelector("#container");

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
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        container.scrollTop += container.clientHeight;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        container.scrollTop -= container.clientHeight;
      }
    }

    window.location.hash = "#me";

    const firstSection = firstSectionRef.current;
    const lastSection = lastSectionRef.current;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if(device === "mobile") return;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === lastSection) {
            firstSection?.scrollIntoView({ behavior: 'instant', block: 'center'})
          } else if (entry.target === firstSection) {
            lastSection?.scrollIntoView({ behavior: 'instant', block: 'center' })
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: container,
      threshold: 0.1,
    });

    if (firstSection && lastSection && device !== 'mobile') {
      observer.observe(firstSection);
      observer.observe(lastSection);
    }

    container?.addEventListener("scroll", navActive, { passive: true });
    window.addEventListener("keydown", movePages);
    return () => {
      container?.removeEventListener("scroll", navActive);
      window.removeEventListener("keydown", movePages);
      observer.disconnect();
    };
  }, []);

  return (
    <main

      className="h-screen flex flex-col items-center justify-center lg:p-4 pb-12 p-2"
    >
      <Head>
        <title>Marban.</title>
        <meta
          name="description"
          content="I am Rahul Marban, currently pursuing CSE with AIML at SRMIST. While I am passionate about AI, my true love lies in designing interfaces that combine aesthetic appeal with strong user experiences."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Scroller>
        <div className="py-3" ref={firstSectionRef} />
        <Hero />
        <About />
        <Journey />
        <Work />
        <Connect />
        <Hero noanim />
        <div className="py-3" ref={lastSectionRef} />
      </Scroller>
      <Navbar />
    </main>
  );
}
