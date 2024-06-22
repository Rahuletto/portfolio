import Image from "next/image";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

const cloudflareLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};

const BsArrowUpRightCircle = dynamic(
  () => import("react-icons/bs").then((a) => a.BsArrowUpRightCircle),
  { ssr: false }
);

interface ProjectProps {
  title: string;
  link: string;
  image: string;
  left?: boolean;
}

export default function Project({ title, link, image, left }: ProjectProps) {
  return (
    <motion.div
      initial={{ x: 10 }}
      exit={{ x: 10 }}
      viewport={{ once: true }}
      whileInView={{
        x: 0,
        transition: { duration: 0.3, delay: 0.3, type: "spring", bounce: 0.2 },
      }}
      className="hover:drop-shadow-xl hover:z-20 z-0 relative col-span-2 aspect-video h-full w-full bg-border rounded-[3.4rem] snap-center hover:scale-95 transform-all ease-bouncy duration-500"
    >
      <Link
        id="project"
        href={link}
        target="_blank"
        className="aspect-video text-3xl font-regular underline"
      >
        <div
          id="text"
          className="rounded-full bg-[rgba(8,8,8,0.4)] flex justify-between items-center m-4 absolute bottom-0 left-0 z-10 w-[91%] p-5 lg:opacity-0"
        >
          <h2 className="text-color">{title}</h2>
          <BsArrowUpRightCircle className="text-color" />
        </div>

        <Image
          loader={cloudflareLoader}
          fill
          src={image}
          alt={title}
          className={`rounded-[3.4rem] ${
            left ? "object-left-top object-cover" : "object-cover"
          }`}
        />
      </Link>
    </motion.div>
  );
}
