import { tw } from "../../twind/twind";
import * as m from "motion/react-m";
import { lazy } from "react";

const FaArrowUp = lazy(() =>
    import("react-icons/fa6").then((module) => ({ default: module.FaArrowUp }))
);
const FaGithub = lazy(() =>
    import("react-icons/fa6").then((module) => ({ default: module.FaGithub }))
);
const FaInstagram = lazy(() =>
    import("react-icons/fa6").then((module) => ({
        default: module.FaInstagram,
    }))
);
const FaLinkedinIn = lazy(() =>
    import("react-icons/fa6").then((module) => ({
        default: module.FaLinkedinIn,
    }))
);
const FaXTwitter = lazy(() =>
    import("react-icons/fa6").then((module) => ({ default: module.FaXTwitter }))
);

export default function Footer() {
    return (
        <footer
            className={tw(
                "h-screen bg-red w-screen z-20 relative text-background p-8 pt-24 md:p-24 flex flex-col items-end justify-start gap-6",
            )}
        >
            <m.h1
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                style={{
                    willChange: "opacity, filter",
                }}
                transition={{
                    duration: 1,
                    delay: 0.3,
                    ease: [0.25, 0.8, 0.25, 1],
                }}
                className={tw(
                    "text-5xl md:text-6xl mb-6 opacity-100 lg:text-7xl xl:text-8xl font-semibold text-right text-background",
                )}
            >
                Building a story<br />through code.
            </m.h1>
            <m.div
                className={tw("bg-background rounded-full p-1 flex gap-2")}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                style={{
                    willChange: "opacity, filter",
                }}
            >
                <m.a
                    href="https://github.com/rahuletto"
                    className={tw(
                        "rounded-full p-3 px-6 md:px-9 cursor-pointer",
                    )}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7,
                        willChange: "background, color, opacity",
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                    whileTap={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                >
                    <FaGithub className={tw("text-2xl md:text-4xl")} />
                </m.a>
                <m.a
                    href="https://linkedin.com/in/rahul-marban"
                    className={tw(
                        "rounded-full p-3 px-6 md:px-9 cursor-pointer",
                    )}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7,
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                    whileTap={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                    style={{
                        willChange: "background, color, opacity",
                    }}
                >
                    <FaLinkedinIn className={tw("text-2xl md:text-4xl")} />
                </m.a>
                <m.a
                    href="https://x.com/rahuletto"
                    className={tw(
                        "rounded-full p-3 px-6 md:px-9 cursor-pointer",
                    )}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7,
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                    whileTap={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                    style={{
                        willChange: "background, color, opacity",
                    }}
                >
                    <FaXTwitter className={tw("text-2xl md:text-4xl")} />
                </m.a>
                <m.a
                    style={{
                        willChange: "background, color, opacity",
                    }}
                    href="https://instagram.com/rahul_marban"
                    className={tw(
                        "rounded-full p-3 px-6 md:px-9 cursor-pointer",
                    )}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7,
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                    whileTap={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                >
                    <FaInstagram className={tw("text-2xl md:text-4xl")} />
                </m.a>
            </m.div>

            <m.div
                className={tw("rounded-full p-1 flex gap-2")}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
            >
                <m.a
                    href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Rahuletto/auto-resume/main/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={tw(
                        "rounded-full p-3 px-9 border-4 text-xl md:text-2xl font-semibold border-background cursor-pointer",
                    )}
                    initial={{
                        background: "#00000000",
                        color: "var(--background)",
                        opacity: 0.7,
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                    whileTap={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1,
                    }}
                >
                    Résumé
                </m.a>
                <m.button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })}
                    className={tw(
                        "rounded-full p-3 aspect-square w-[60px] h-[60px] flex items-center justify-center border-4 font-semibold border-background cursor-pointer",
                    )}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                    }}
                >
                    <FaArrowUp className={tw("text-2xl md:text-3xl")} />
                </m.button>
            </m.div>

            <img
                src="/bye.png"
                alt="Bye"
                className="h-72 md:h-96 z-10 saturate-0 absolute bottom-0 left-0"
            />
            <div className="absolute left-0 px-8 pl-32 md:pl-24 md:px-24 w-full bottom-24 flex gap-12 items-center justify-between w-full">
                <hr className="w-full border-2 border-background" />
                <img
                    src="/svgs/signature.svg"
                    alt="Signature"
                    className="h-12"
                />
            </div>
        </footer>
    );
}
