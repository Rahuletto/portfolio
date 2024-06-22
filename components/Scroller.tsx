import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ScrollerProps {
  children: ReactNode;
}

export default function Scroller({ children }: ScrollerProps) {
  return (
    <div
      id="container"
      style={{ width: "calc(100vw - 42px)", height: "calc(100vh - 72px)" }}
      className="outline-none border-2 border-border rounded-3xl flex fixed top-5 left-5 flex-col overflow-y-scroll snap-y snap-mandatory bg-container"
    >
      {
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: false }}
          className="flex gap-2 flex-col"
        >
          {children}
        </motion.div>
      }
    </div>
  );
}
