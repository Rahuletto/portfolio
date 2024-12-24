import React from "react";
const ClassPro = React.lazy(() => import("./projects/ClassPro"));
const SimplyDJS = React.lazy(() => import("./projects/SimplyDJS"));
const Unix = React.lazy(() => import("./projects/Unix"));
const Rocket = React.lazy(() => import("./projects/Rocket"));
import { tw } from "../../twind/twind";
import * as m from "motion/react-m"

const Projects: React.FC = () => {
    return (
        <div>
            <ClassPro />
            <SimplyDJS />
            <Unix />
            <Rocket />
            <div className={tw("mt-3 flex items-center justify-center")}>
                <m.a
                    href="https://unixporn-dots.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={tw(
                        "text-color flex w-fit items-center px-6 gap-4 text-lg py-2 rounded-full bg-transparent border-2 border-color",
                    )}
                    whileHover={{
                        scale: 0.95,
                        backgroundColor: "var(--color)",
                        color: "var(--background)",
                    }}
                    whileTap={{
                        scale: 0.95,
                        backgroundColor: "var(--color)",
                        color: "var(--background)",
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                    }}
                >
                    <span className={tw("font-semibold")}>
                        View all projects{" "}
                    </span>
                    <m.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={tw("md:text-lg lg:text-xl text-sm")}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ x: 0, y: 0 }}
                        whileHover={{ x: 3, y: -3 }}
                        whileTap={{ x: 3, y: -3 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                        }}
                    >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </m.svg>
                </m.a>
            </div>
        </div>
    );
};

export default Projects;
