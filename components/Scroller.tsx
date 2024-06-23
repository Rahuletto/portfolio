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
        height: "calc(100% - 72px)",
      }}
      className="outline-none border-2 border-border rounded-3xl flex touch-manipulation fixed md:top-5 md:left-5 md:w-[calc(100% - 32px)] top-2 left-2 w-[calc(100% - 16px)] flex-col overflow-y-scroll snap-y snap-mandatory bg-container"
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
