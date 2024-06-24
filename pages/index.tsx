import About from "@/components/slides/About";
import Connect from "@/components/slides/Connect";
import Hero from "@/components/slides/Hero";
import Journey from "@/components/slides/Journey";
import Work from "@/components/slides/Work";
import { useDevice } from "@/provider/DeviceProvider";
import dynamic from "next/dynamic";
import Head from "next/head";

const Navbar = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
});

const Scroller = dynamic(() => import("@/components/Scroller"), {
  ssr: true,
});

import { useEffect, useRef } from "react";

export default function Home() {
  const device = useDevice();
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef<HTMLDivElement>(null);
  const scrollTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const menu_links = document.querySelectorAll("#scrollLink");
    const container = document.querySelector("#container");

    const firstSection = firstSectionRef.current;
    const lastSection = lastSectionRef.current;
    const scrollToTop = scrollTop.current;

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

    window.location.hash = "#me";

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && device !== "mobile") {
          if (entry.target === lastSection) {
            firstSection?.scrollIntoView({
              behavior: "instant",
              block: "center",
            });
          } else if (entry.target === firstSection) {
            lastSection?.scrollIntoView({
              behavior: "instant",
              block: "center",
            });
          }
        } else if (entry.isIntersecting && device == "mobile") {
          if (entry.target === scrollToTop) {
            setTimeout(() => {
              container?.scrollTo({
                behavior: "smooth",
                top: 0,
              });
            }, 700);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: container,
      threshold: 0.000001,
    });

    const topScroll = new IntersectionObserver(handleIntersect, {
      root: container,
      threshold: 1,
    });

    if (firstSection && lastSection && device !== "mobile") {
      observer.observe(firstSection);
      observer.observe(lastSection);
    } else if (scrollToTop && device == "mobile") {
      topScroll.observe(scrollToTop);
    }

    container?.addEventListener("scroll", navActive, { passive: true });
    window.addEventListener("keydown", movePages);
    return () => {
      container?.removeEventListener("scroll", navActive);
      window.removeEventListener("keydown", movePages);
      observer.disconnect();
      topScroll.disconnect();
    };
  }, [device]);

  return (
    <main className="h-screen flex flex-col items-center justify-between lg:p-4 md:pb-12 p-0">
      <Head>
        <title>Marban.</title>
        <meta
          name="description"
          content="I am Rahul Marban, currently pursuing CSE with AIML at SRMIST. While I am passionate about AI, my true love lies in designing interfaces that combine aesthetic appeal with strong user experiences."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Scroller>
        <div className="py-8 mb-4 w-full" ref={firstSectionRef} />
        <Hero />
        <About />
        <Journey />
        <Work />
        <Connect />
        {device !== "mobile" && <Hero noanim />}
        {device !== "mobile" ? (
          <div className="py-8 mb-4  w-full" ref={lastSectionRef} />
        ) : (
          <div
            className="py-8 mb-4 w-full bg-copper flex justify-center items-center rounded-full text-deep font-semibold text-2xl"
            ref={scrollTop}
          >
            Scroll to top
          </div>
        )}
      </Scroller>
      <Navbar />
    </main>
  );
}
