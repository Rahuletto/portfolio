import { motion } from "framer-motion";
import { WipeText } from "./WipeText";

interface SubheadProps {
  text: string;
}

export default function Subhead({ text }: SubheadProps) {

  return (
    <motion.div className="flex gap-4 mt-4 justify-start items-center flex-wrap pb-4">
      <motion.svg
        whileHover={{ scaleX: 1.7, width: 60 }}
        initial={{ width: 0, scaleX: 0 }}
        style={{ transformOrigin: "right" }}
        whileInView={{
          scaleX: 0.5,
          width: 41,
          transition: { duration: 0.2, delay: 0.1 },
        }}
        transition={{ delay: 0, type: "spring", bounce: 0.3 }}
        height="4"
        viewBox="0 0 41 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          whileHover={{ width: 60 }}
          initial={{ pathLength: 0, visibility: "hidden" }}
          whileInView={{ pathLength: 1, visibility: "visible" }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            width: { type: "spring", bounce: 0.3, delay: 0 },
          }}
          d="M2 2H39"
          stroke="#D6BFB2"
          style={{ stroke: "var(--copper)", strokeOpacity: 1 }}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.svg>
      <h2 className="lg:text-4xl text-3xl text-copper">
        <WipeText text={text} delay={0.8} />
      </h2>
      <motion.svg
        whileHover={{ scaleX: 1.7, width: 60 }}
        initial={{ width: 0, scaleX: 0 }}
        style={{ transformOrigin: "left" }}
        whileInView={{
          width: 32,
          transition: { duration: 0.4, delay: 0.4 },
          scaleX: 2.2,
        }}
        transition={{ delay: 0.3, type: "spring", bounce: 0.3 }}
        height="4"
        viewBox="0 0 32 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          whileHover={{ width: 60 }}
          initial={{ pathLength: 0, visibility: "hidden" }}
          whileInView={{
            pathLength: 1,
            visibility: "visible",
            transition: { delay: 0.5 },
          }}
          transition={{
            duration: 0.4,
            delay: 0,
            width: { type: "spring", bounce: 0.3 },
          }}
          d="M2 2H39"
          stroke="#D6BFB2"
          style={{ stroke: "var(--copper)", strokeOpacity: 1 }}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
}
