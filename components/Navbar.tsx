import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 sm:bottom-3 w-full"
    >
      <div className="flex gap-1 justify-center items-center max-w-[250px] rounded-full m-auto">
        <Link
          id="scrollLink"
          className="hover:px-8 rounded-full px-5 active:px-6 bg-border opacity-60 font-medium text-sm sm:text-lg active transition-all duration-500 ease-bouncy"
          href="#me"
        >
          Me
        </Link>
        <Link
          id="scrollLink"
          className="hover:px-8 rounded-full px-5 active:px-6 bg-border opacity-60 font-medium text-sm sm:text-lg transition-all duration-500 ease-bouncy"
          href="#journey"
        >
          Journey
        </Link>
        <Link
          id="scrollLink"
          className="hover:px-8 rounded-full px-5 active:px-6 bg-border opacity-60 font-medium text-sm sm:text-lg transition-all duration-500 ease-bouncy"
          href="#work"
        >
          Work
        </Link>
        <Link
          id="scrollLink"
          className="hover:px-8 active:px-6 rounded-full px-5  bg-border opacity-60 font-medium text-sm sm:text-lg transition-all duration-500 ease-bouncy"
          href="#connect"
        >
          Connect
        </Link>
      </div>
    </motion.nav>
  );
}
