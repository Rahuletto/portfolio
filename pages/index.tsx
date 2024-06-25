import About from "@/components/slides/About";
import Connect from "@/components/slides/Connect";
import Hero from "@/components/slides/Hero";
import Journey from "@/components/slides/Journey";
import Work from "@/components/slides/Work";
import { useDevice } from "@/provider/DeviceProvider";
import Navbar from "@/components/Navbar";
import Scroller from "@/components/Scroller";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

export default function Home() {
  const device = useDevice();
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef<HTMLDivElement>(null);
  const scrollTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.querySelector("#container");

    const firstSection = firstSectionRef.current;
    const lastSection = lastSectionRef.current;
    const scrollToTop = scrollTop.current;

    window.location.hash = "#me";

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && device !== "mobile") {
          if (entry.target === lastSection) {
            firstSection?.scrollIntoView({
              behavior: "instant",
              block: "end",
            });
          } else if (entry.target === firstSection) {
            lastSection?.scrollIntoView({
              behavior: "instant",
              block: "start",
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

    return () => {
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
          <div className="py-8 mb-4 w-full" ref={lastSectionRef} />
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
