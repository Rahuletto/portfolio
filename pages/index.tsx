import Navbar from "@/components/Navbar";
import Scroller from "@/components/Scroller";
import About from "@/components/slides/About";
import Connect from "@/components/slides/Connect";
import Hero from "@/components/slides/Hero";
import Journey from "@/components/slides/Journey";
import Work from "@/components/slides/Work";
import Head from "next/head";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const menu_links = document.querySelectorAll("#scrollLink");

    const container = document.querySelector("#container");

    container?.scrollTo({ top: 11, behavior: "instant" });

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

      if (pos >= 5) {
        if (newScroll >= sections[sections.length - 1].offsetTop + 5) {
          container.scrollTo({
            behavior: "instant",
            top: 10,
          });
        }
      } else if (pos == 0 && newScroll < 10) {
        container.scrollTo({
          behavior: "instant",
          top: sections[sections.length - 1].offsetTop - 100,
        });
      }

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

    container?.addEventListener("scroll", navActive);
    window.addEventListener("keydown", movePages);

    window.location.hash = "#me";

    return () => {
      container?.removeEventListener("scroll", navActive);
      window.removeEventListener("keydown", movePages);
    };
  }, []);
  return (
    <main className="h-screen flex flex-col items-center justify-center p-4 pb-12">
      <Head>
        <title>Marban.</title>
        <meta name="description" content="I am Rahul Marban, currently pursuing CSE with AIML at SRMIST. While I am passionate about AI, my true love lies in designing interfaces that combine aesthetic appeal with strong user experiences." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Scroller>
        <div className="py-3" />
        <Hero />
        <About />
        <Journey />
        <Work />
        <Connect />
        <Hero noanim />
        <div className="py-3" />
      </Scroller>
      <Navbar />
    </main>
  );
}
