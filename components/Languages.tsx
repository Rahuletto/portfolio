import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const DiMongodb = dynamic(
  () => import("react-icons/di").then((a) => a.DiMongodb),
  { ssr: false }
);
const SiAstro = dynamic(() => import("react-icons/si").then((a) => a.SiAstro), {
  ssr: false,
});
const SiNextdotjs = dynamic(
  () => import("react-icons/si").then((a) => a.SiNextdotjs),
  { ssr: false }
);
const SiSolid = dynamic(() => import("react-icons/si").then((a) => a.SiSolid), {
  ssr: false,
});
const FaFigma = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaFigma),
  { ssr: false }
);
const FaReact = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaReact),
  { ssr: false }
);
const FaPython = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaPython),
  { ssr: false }
);
const FaCss3Alt = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaCss3Alt),
  { ssr: false }
);
const FaNodeJs = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaNodeJs),
  { ssr: false }
);
const FaGitAlt = dynamic(
  () => import("react-icons/fa6").then((a) => a.FaGitAlt),
  { ssr: false }
);
const TbBrandFramerMotion = dynamic(
  () => import("react-icons/tb").then((a) => a.TbBrandFramerMotion),
  { ssr: false }
);
const RiSupabaseFill = dynamic(
  () => import("react-icons/ri").then((a) => a.RiSupabaseFill),
  { ssr: false }
);
const RiTailwindCssFill = dynamic(
  () => import("react-icons/ri").then((a) => a.RiTailwindCssFill),
  { ssr: false }
);
const BiLogoJavascript = dynamic(
  () => import("react-icons/bi").then((a) => a.BiLogoJavascript),
  { ssr: false }
);
const BiLogoTypescript = dynamic(
  () => import("react-icons/bi").then((a) => a.BiLogoTypescript),
  { ssr: false }
);

const slides = [
  { icon: <BiLogoJavascript className="text-[#F8DB3D]" size={36} /> },
  { icon: <BiLogoTypescript className="text-[#3078C6]" size={36} /> },
  { icon: <FaReact className="text-[#61DAFB]" size={36} /> },
  { icon: <TbBrandFramerMotion className="text-[#ED18BF]" size={36} /> },
  { icon: <FaPython className="text-[#346EA0]" size={36} /> },
  { icon: <DiMongodb className="text-[#23ED69]" size={36} /> },
  { icon: <RiSupabaseFill className="text-[#3ECF8F]" size={36} /> },
  { icon: <FaCss3Alt className="text-[#1999DD]" size={36} /> },
  { icon: <RiTailwindCssFill className="text-[#26C0CC]" size={36} /> },
  { icon: <SiAstro className="text-[#9250E5]" size={36} /> },
  { icon: <FaNodeJs className="text-[#84BF18]" size={36} /> },
  { icon: <FaGitAlt className="text-[#F1573B]" size={36} /> },
  { icon: <FaFigma className="text-[#FF611B]" size={36} /> },
  { icon: <SiNextdotjs className="text-[#fff]" size={36} /> },
  { icon: <SiSolid className="text-[#8ABEE7]" size={36} /> },
];

const LanguageSlider = () => {
  const duplicatedSlides = [...slides, ...slides];

  return (
    <div className="relative h-full w-full overflow-hidden pt-12">
      <div className="absolute inset-0 z-20 pointer-events-none before:absolute before:left-0 before:top-0 before:w-40 before:h-full before:bg-gradient-to-r before:from-container before:to-transparent before:filter before:blur-3 after:absolute after:right-0 after:top-0 after:w-40 after:h-full after:bg-gradient-to-l after:from-container after:to-transparent after:filter after:blur-3"></div>

      <motion.div
        className="flex gap-0"
        animate={{
          x: ["-150%", "0%"],
          transition: {
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          },
        }}
      >
        {duplicatedSlides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center h-full py-4 opacity-70"
              id="icon"
              style={{ width: `${150 / slides.length}%` }}
            >
              {Icon}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LanguageSlider;
