import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ASSETS, NAV_ITEMS } from "@/lib/constants";
import { scrollToId, openLink } from "@/lib/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useClickOutside(navRef, () => {
    if (open) setOpen(false);
  });

  const handleNavClick = (id: string) => {
    if (id === "resume") {
      openLink("https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Rahuletto/auto-resume/main/resume.pdf");
      return;
    }
    scrollToId(id);
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 4.0, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="fixed top-0 right-4 md:right-12 lg:right-24 z-50"
    >
      <div
        ref={navRef}
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <motion.div
          layout
          className="overflow-hidden rounded-b-2xl border-2 border-t-0 border-dark bg-light text-dark"
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!open ? (
              <motion.button
                key="trigger"
                type="button"
                aria-label="Explore sections"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                onClick={() => setOpen(true)}
                className="flex h-14 w-16 md:w-76 items-center justify-center md:justify-between px-4 md:px-6"
              >
                <span className="hidden md:block text-xl leading-none font-medium">
                  Explore
                </span>
                <img
                  src="/assets/icons/cursor.svg"
                  alt=""
                  className="h-6 w-6 shrink-0"
                />
              </motion.button>
            ) : (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="w-76"
              >
                {NAV_ITEMS.map((item, index) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.35,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    className={`flex w-full items-center cursor-pointer justify-between px-6 py-3.5 text-left transition-colors duration-200 focus:outline-none ${index !== NAV_ITEMS.length - 1
                      ? "border-b-2 border-[#d8d4ce]"
                      : ""
                      }`}
                  >
                    <span className="text-xl leading-none font-medium">
                      {item.label}
                    </span>
                    <img
                      src={item.icon}
                      alt={item.alt}
                      className="h-7 w-7 shrink-0"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Header;
