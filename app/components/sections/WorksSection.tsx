import Marquee from "@/components/Marquee";
import RainbowStrings from "@/components/RainbowStrings";
import { useMeshTheme } from "@/context/MeshThemeContext";
import { motion } from "motion/react";

export default function WorksSection() {
  const { setTheme } = useMeshTheme();
  
  return (
    <motion.section
      id="developer"
      initial={{ y: "100vh" }}
      animate={{ y: 0 }}
      transition={{ delay: 3.6, duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
      className="bg-dark h-full w-full rounded-t-[52px] relative z-10"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 4.6, duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-32 z-20"
      >
        <Marquee />
      </motion.div>
      <RainbowStrings className="mt-2" onColorClick={setTheme} />
    </motion.section>
  );
}
