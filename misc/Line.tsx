
import { motion } from "framer-motion";
import { useDevice } from "@/provider/DeviceProvider";

interface LineProps {
  delay?: number;
}

export default function Line({ delay }: LineProps) {
  const device = useDevice()
  return (
    <motion.svg
      whileHover={{ scaleX: 1.7, width: 60 }}
      initial={{ width: 0 }}
      animate={{ width: (device == 'desktop' ? 41: 20), transition: { duration: 0.4, delay: delay || 0 } }}
      transition={{ delay: 0, type: "spring", bounce: 0.3 }}
      height="4"
      viewBox="0 0 41 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        whileHover={{ width: (device == 'desktop' ? 60: 30) }}
        initial={{ pathLength: 0, visibility: "hidden" }}
        animate={{ pathLength: 1, visibility: "visible" }}
        transition={{
          duration: 0.4,
          delay: delay || 0,
          width: { type: "spring", bounce: 0.3, delay: 0 },
        }}
        d="M2 2H39"
        stroke="#D6BFB2"
        style={{ stroke: "var(--copper)", strokeOpacity: 1 }}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
