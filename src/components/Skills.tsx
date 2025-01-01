import { FC, useEffect, useRef, useState } from "react";
import {
    AnimatePresence,
    cubicBezier,
    useInView,
    useScroll,
    useTransform,
} from "motion/react";
import * as m from "motion/react-m"

import { tw } from "../../twind/twind";
import NumberFlow from "@number-flow/react";

const skillsData = [
    {
        type: "Languages",
        items: [
            "JavaScript",
            "TypeScript",
            "Python",
            "C",
            "Java",
            "Go",
        ],
    },
    {
        type: "Frameworks",
        items: [
            "Next.js",
            "React",
            "Astro",
            "Solid",
            "Fresh",
            "FastAPI",
            "Pytorch",
            "Express",
            "Hono",
            "ElysiaJS",
            "React Native",
            "Tauri",
            "Framer Motion",
            "TailwindCSS",
        ],
    },
    {
        type: "Tools",
        items: [
            "VS Code",
            "WSL",
            "GitHub",
            "Figma",
            "MongoDB",
            "PostgreSQL",
            "Cloudflare D1",
            "Supabase",
            "Node.js",
            "Bun",
            "Deno",
        ],
    },
];

const SkillsSection: FC = () => {
    const [currentSection, setCurrentSection] = useState<number>(0);
    const sectionRefs = useRef<HTMLDivElement[]>([]);
    const numRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        sectionRefs.current.forEach((ref, index) => {
            if (ref) {
                const rect = ref.getBoundingClientRect();
                if (
                    rect.top < window.innerHeight * 0.4 &&
                    rect.bottom > window.innerHeight * 0.3
                ) {
                    setCurrentSection(index);
                }
            }
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div
                className={tw(
                    "md:sticky h-full min-h-[78vh] hidden md:flex justify-between flex-col md:block bg-transparent top-28 min-w-[40%]",
                )}
            >
                <div>
                    <h2 className={tw("text-xl font-semibold opacity-70 mb-2")}>
                        Skills
                    </h2>
                    <AnimatePresence mode="wait">
                        <m.h1
                            key={currentSection}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{
                                duration: 0.5,
                                ease: [0.25, 0.8, 0.25, 1],
                            }}
                            className={tw(
                                "inline-block font-semibold text-6xl font-semibold",
                            )}
                        >
                            {skillsData[currentSection]?.type ||
                                "Skills Overview"}
                        </m.h1>
                    </AnimatePresence>
                    <p
                        className={tw(
                            "opacity-40 text-color text-base mt-3 max-w-[400px]",
                        )}
                    >
                        With 4 years in tech, I've built projects, mastered
                        tools, and collaborated with amazing teams. From coding
                        to cloud technologies, I've worked on solutions that
                        make an impact. Here&apos;s what I bring to the table!
                    </p>
                </div>
                <div className={tw("")} ref={numRef}>
                    {currentSection == 0
                        ? (
                            <p
                                className={tw(
                                    "opacity-40 text-color text-base mb-3 max-w-[400px]",
                                )}
                            >
                                It&apos;s not about the quantity, it&apos;s
                                about the quality. I&apos;ve worked on projects
                                that matter.
                            </p>
                        )
                        : (
                            <p
                                className={tw(
                                    "opacity-40 text-color text-base mb-3 max-w-[400px]",
                                )}
                            >
                                Development isn&apos;t just about code,
                                it&apos;s about the people and the impact we
                                make.
                            </p>
                        )}
                    <div className={tw("flex items-center justify-between")}>
                        <div className={tw("min-w-[100px]")}>
                            <NumberFlow
                                value={useInView(numRef)
                                    ? currentSection == 0
                                        ? 35
                                        : currentSection == 1
                                        ? 1200000
                                        : 78009
                                    : 0}
                                className={tw("text-6xl font-semibold text-color")}
                                format={{
                                    compactDisplay: "short",
                                    notation: "compact",
                                }}
                                suffix="+"
                            />
                            <p
                                className={tw(
                                    "opacity-40 text-color text-base -mt-4 max-w-[400px]",
                                )}
                            >
                                {currentSection == 0
                                    ? "open-source projects"
                                    : currentSection == 1
                                    ? "visits/month"
                                    : "visits/day"}
                            </p>
                        </div>
                        <div className={tw("min-w-[100px]")}>
                            <NumberFlow
                                value={useInView(numRef)
                                    ? currentSection == 0
                                        ? 230
                                        : currentSection == 1
                                        ? 25000
                                        : 9068
                                    : 0}
                                className={tw("text-6xl font-semibold text-color")}
                                format={{
                                    compactDisplay: "short",
                                    notation: "compact",
                                }}
                                suffix="+"
                            />
                            <p
                                className={tw(
                                    "opacity-40 text-color text-base -mt-4 max-w-[400px]",
                                )}
                            >
                                {currentSection == 0
                                    ? "github stars"
                                    : currentSection == 1
                                    ? "users/month"
                                    : "users/day"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={tw(
                    "border-l-2 sticky opacity-70 hidden lg:flex border-color h-screen md:top-0",
                )}
            />

            <div className="min-w-[40%] md:pb-48 w-full md:!w-fit">
                {skillsData.map((section, sectionIndex) => (
                    <div
                        key={sectionIndex}
                        ref={(
                            el,
                        ) => (sectionRefs.current[sectionIndex] =
                            el as HTMLDivElement)}
                        className={tw(
                            `flex flex-col gap-12 mt-10 pb-12 w-full ${
                                sectionIndex !== skillsData?.length - 1 &&
                                "border-b border-color"
                            }`,
                        )}
                    >
                        <div
                            className={tw(
                                "md:hidden block bg-transparent min-w-[40%]",
                            )}
                        >
                            <h2
                                className={tw(
                                    "text-xl font-semibold opacity-70 mb-2",
                                )}
                            >
                                Skills
                            </h2>
                            <h1 className={tw("text-4xl font-semibold")}>
                                {section.type}
                            </h1>
                        </div>

                        <div className={tw("flex overflow-scroll flex-col gap-3 md:gap-6")}>
                            {section.items.map((item, itemIndex) => (
                                <SkillItem
                                    key={`${sectionIndex}-${itemIndex}`}
                                    item={item}
                                    index={itemIndex}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

const SkillItem: FC<{ item: string; index: number }> = ({ item }) => {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 90vh", "end 20vh"],
    });

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        [window.innerWidth <= 768 ? 100 : 300, 0],
        {
            ease: cubicBezier(0.645, 0.045, 0.355, 1),
        }
    );
    const opacity = useTransform(scrollYProgress, [0, 0.1, 1], [0, 0, 1]);

    return (
        <m.div
            ref={ref}
            style={{ x: x.get(), opacity: opacity.get(), willChange: "transform, opacity" }}
            className={tw("text-2xl md:text-2xl xl:text-3xl text-color w-fit font-semibold")}
        >
            {item}
        </m.div>
    );
};

export default SkillsSection;
