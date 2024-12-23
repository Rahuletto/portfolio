import { tw } from "../../twind/twind";
import { motion } from "motion/react";
import { FaArrowUp, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer
            className={tw(
                "h-screen bg-red w-screen z-20 relative text-background p-16 pt-24 md:p-24 flex flex-col items-end justify-start gap-6",
            )}
        >
            <motion.h1
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{
                    duration: 1,
                    delay: 0.3,
                    ease: [0.25, 0.8, 0.25, 1],
                }}
                className={tw(
                    "text-5xl md:text-6xl mb-6 opacity-100 lg:text-7xl xl:text-8xl font-bold text-right text-background",
                )}
            >
                Building a story<br />through code.
            </motion.h1>
            <motion.div
                className={tw("bg-background rounded-full p-1 flex gap-2")}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
            >
                <motion.a
                    href="https://github.com/rahuletto"
                    className={tw("rounded-full p-3 px-6 md:px-9 cursor-pointer")}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1
                    }}
                >
                    <FaGithub className={tw("text-2xl md:text-4xl")} />
                </motion.a>
                <motion.a
                    href="https://linkedin.com/in/rahul-marban"
                    className={tw("rounded-full p-3 px-6 md:px-9 cursor-pointer")}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1
                    }}
                >
                    <FaLinkedinIn className={tw("text-2xl md:text-4xl")} />
                </motion.a>
                <motion.a
                    href="https://x.com/rahuletto"
                    className={tw("rounded-full p-3 px-6 md:px-9 cursor-pointer")}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1
                    }}
                >
                    <FaXTwitter className={tw("text-2xl md:text-4xl")} />
                </motion.a>
                <motion.a
                    href="https://instagram.com/rahul_marban"
                    className={tw("rounded-full p-3 px-6 md:px-9 cursor-pointer")}
                    initial={{
                        background: "var(--background)",
                        color: "var(--color)",
                        opacity: 0.7
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1
                    }}
                >
                    <FaInstagram className={tw("text-2xl md:text-4xl")} />
                </motion.a>
                
                
            </motion.div>

            <motion.div
                className={tw("rounded-full p-1 flex gap-2")}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
            >
                <motion.a
                    href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Rahuletto/auto-resume/main/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={tw("rounded-full p-3 px-9 border-4 text-xl md:text-2xl font-bold border-background cursor-pointer")}
                    initial={{
                        background: "#00000000",
                        color: "var(--background)",
                        opacity: 0.7
                    }}
                    whileHover={{
                        background: "var(--color)",
                        color: "var(--background)",
                        opacity: 1
                    }}
                >
                    Résumé
                </motion.a>
                <motion.button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={tw("rounded-full p-3 border-4 font-bold border-background cursor-pointer")}
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
                </motion.button>
            </motion.div>

            <img
                src="/bye.png"
                alt="Bye"
                className="h-72 md:h-96 z-10 saturate-0 absolute bottom-0 left-0"
            />
            <div className="absolute left-0 px-16 pl-32 md:pl-24 md:px-24 w-full bottom-24 flex gap-12 items-center justify-between w-full">
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

