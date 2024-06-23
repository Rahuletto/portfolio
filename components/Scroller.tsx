import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useDevice } from "@/provider/DeviceProvider";

interface ScrollerProps {
  children: ReactNode;
}

export default function Scroller({ children }: ScrollerProps) {
  const device = useDevice();
  return (
    <div
      id="container"
      style={{
        width: device === "mobile" ? "calc(100% - 14px)" : "calc(100% - 32px)",
        height: device === "mobile" ? "calc(100%)" : "calc(100% - 72px)",
      }}
      className="outline-none md:border-2 md:border-border rounded-3xl flex touch-manipulation fixed md:top-5 md:left-5 md:w-[calc(100% - 32px)] w-[calc(100% - 16px)] flex-col overflow-y-scroll snap-y snap-mandatory md:bg-container"
    >
      {
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: false }}
          className="flex gap-2 flex-col md:p-0 p-3"
        >
          {children}
        </motion.div>
      }
    </div>
  );
}
