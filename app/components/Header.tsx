import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  {
    id: "developer",
    label: "Works",
    icon: "/assets/icons/spanner.svg",
    alt: "Works",
  },
  {
    id: "hero",
    label: "Me",
    icon: "/assets/icons/me.svg",
    alt: "Me",
  },
  {
    id: "resume",
    label: "Download Resume",
    icon: "/assets/icons/star.svg",
    alt: "Download Resume",
  },
] as const;

const handleNavClick = (id: string) => {
  if (id === "resume") {
    window.open(
      "https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Rahuletto/auto-resume/main/resume.pdf",
      "_blank",
    );
    return;
  }
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
};

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-24 z-50">
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <motion.div
          layout
          className="w-76 overflow-hidden rounded-b-2xl border-2 border-t-0 border-dark bg-light text-dark"
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
                className="flex h-14 w-full items-center justify-between px-6"
              >
                <span className="text-xl leading-none font-medium">
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
              >
                {navItems.map((item, index) => (
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
                    className={`flex w-full items-center cursor-pointer justify-between px-6 py-3.5 text-left transition-colors duration-200 focus:outline-none ${
                      index !== navItems.length - 1
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
    </nav>
  );
};

export default Header;
