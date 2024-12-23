import React, { useLayoutEffect, useRef, useState } from "react";
import { tw } from "../../../twind/twind";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import NumberFlow from "@number-flow/react";

const ClassPro: React.FC = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const [divTop, setDivTop] = useState(0);
    const [divHeight, setDivHeight] = useState(0);
    const numRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (divRef.current) {
            setDivTop(divRef.current.offsetTop);
            setDivHeight(divRef.current.offsetHeight);
        }
    }, [divRef]);

    const divCenter = React.useMemo(() => divTop + divHeight * 0.5, [divTop, divHeight]);

    const width = useTransform(scrollY, [
        divCenter - 500,
        divCenter + 100,
    ], [
        "70vw",
        "100vw",
    ], { clamp: true });
    const height = useTransform(scrollY, [
        divCenter - 500,
        divCenter + 100,
    ], [
        "70vh",
        "100vh",
    ], { clamp: true });
    const borderRadius = useTransform(scrollY, [
        divCenter - 500,
        divCenter + 100,
    ], ["38px", "0px"], { clamp: true });

    return (
        <motion.div
            ref={divRef}
            className={tw(
                "bg-color mx-auto flex items-start gap-2 justify-end flex-col rounded-3xl aspect-[16/10] mt-12 p-4 sm:p-8 md:p-16 lg:p-24 py-12 sm:py-24 md:py-36 lg:py-32",
            )}
            style={{
                width,
                backgroundImage: "url(/projects/classpro.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height,
                borderRadius,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div
                className={tw(
                    "flex flex-col gap-4 lg:flex-row items-start lg:gap-4 justify-between w-full",
                )}
            >
                <div>
                    <motion.h1
                        className={tw(
                            "text-color w-fit text-3xl mb-1 md:!mb-2 flex items-center gap-6 md:text-4xl lg:text-5xl font-bold",
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.2,
                        }}
                    >
                        ClassPro
                        <motion.a
                            href="https://class-pro.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={tw(
                                "text-color flex w-fit items-center px-2 text-lg py-2 rounded-full bg-transparent border-2 border-color",
                            )}
                            whileHover={{
                                scale: 0.95,
                                backgroundColor: "var(--color)",
                                color: "var(--background)",
                            }}
                            whileTap={{ scale: 0.85 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 17,
                            }}
                        >
                            <motion.svg
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
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 10,
                                }}
                            >
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </motion.svg>
                        </motion.a>
                    </motion.h1>
                    <motion.p
                        className={tw(
                            "text-color text-base sm:text-base md:text-lg lg:text-xl",
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 0.5, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.4,
                        }}
                    >
                        University data, beautifully presented at your
                        fingertips.
                    </motion.p>
                </div>
                <div
                    ref={numRef}
                    className={tw(
                        "flex items-center border-t border-color/40 w-full pt-3 md:!w-fit lg:!border-t-0 lg:border-l lg:!pt-0 lg:pl-6 justify-between",
                    )}
                >
                    <div className={tw("min-w-[180px]")}>
                        <NumberFlow
                            value={useInView(numRef) ? 1200000 : 0}
                            className={tw(
                                "lg:text-5xl md:text-4xl text-3xl font-bold text-color",
                            )}
                            format={{
                                compactDisplay: "short",
                                notation: "compact",
                            }}
                            suffix="+"
                        />
                        <p
                            className={tw(
                                "opacity-40 text-color text-sm lg:-mt-4 -mt-2 max-w-[400px]",
                            )}
                        >
                            visits/month
                        </p>
                    </div>
                    <div className={tw("min-w-[180px]")}>
                        <NumberFlow
                            value={useInView(numRef) ? 146000 : 0}
                            className={tw(
                                "lg:text-5xl md:text-4xl text-3xl font-bold text-color",
                            )}
                            format={{
                                compactDisplay: "short",
                                notation: "compact",
                            }}
                            suffix="+"
                        />
                        <p
                            className={tw(
                                "opacity-40 text-color text-sm lg:-mt-4 -mt-2 max-w-[400px]",
                            )}
                        >
                            users/month
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ClassPro;
