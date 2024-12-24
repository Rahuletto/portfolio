import * as m from "motion/react-m"
import { tw } from "../../twind/twind";
import { FaHeart } from "react-icons/fa";

export default function LastSegment() {
    return (
        <m.div
            className={tw(
                "py-32 h-screen flex-col top-0 flex gap-12 items-center justify-center",
            )}
        >
            <div
                className={tw(
                    "flex flex-col gap-4 items-center justify-center",
                )}
            >
                <m.div
                    className={tw("flex items-center justify-center")}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        willChange: "transform",
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.8, 0.25, 1],
                    }}
                >
                    <FaHeart className={tw("text-red text-5xl")} />
                </m.div>
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
                        "text-4xl font-semibold text-center md:text-5xl mt-4",
                    )}
                >
                    Love at first sight
                </m.h1>
                <m.p
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    whileInView={{ opacity: 0.4, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{
                        duration: 1,
                        delay: 0.5,
                        ease: [0.25, 0.8, 0.25, 1],
                    }}
                    className={tw(
                        "text-center max-w-[600px] w-[80vw] md:w-full text-sm md:text-base",
                    )}
                >
                    Pouring passion and precision into every design to create
                    experiences that are visually captivating and intuitively
                    engaging
                </m.p>
            </div>
            <m.a
                href="mailto:rahulmarban@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className={tw(
                    "text-red flex w-fit items-center px-8 gap-4 text-xl py-3 rounded-full bg-transparent border-2 border-red",
                )}
                whileHover={{
                    scale: 0.95,
                    backgroundColor: "var(--red)",
                    color: "var(--background)",
                }}
                whileTap={{
                    scale: 0.95,
                    backgroundColor: "var(--red)",
                    color: "var(--background)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1, transition: { delay: 1 } }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                }}
            >
                <span className={tw("font-semibold")}>
                    Say Hello
                </span>
            </m.a>
        </m.div>
    );
}
