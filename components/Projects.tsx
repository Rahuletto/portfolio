/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useDevice } from "@/provider/DeviceProvider";
import { useRouter } from "next/router";

const BsArrowUpRightCircle = dynamic(
  () => import("react-icons/bs").then((a) => a.BsArrowUpRightCircle),
  { ssr: false }
);

interface ProjectProps {
  title: string;
  link: string;
  image: any;
  left?: boolean;
}

export default function Project({ title, link, image, left }: ProjectProps) {
  const device = useDevice();
  const router = useRouter();

  return (
    <motion.div
      id="project"
      initial={device == "mobile" ? {} : { x: 10 }}
      exit={{ x: device == "mobile" ? 0 : 10 }}
      viewport={{ once: true }}
      whileInView={{
        x: 0,
        transition: { duration: 0.3, delay: 0.3, type: "spring", bounce: 0.2 },
      }}
      className="hover:drop-shadow-xl hover:z-20 z-0 relative col-span-2 aspect-video h-full w-full bg-border rounded-[3.4rem] snap-center hover:scale-95 transform-all ease-bouncy duration-500"
    >
      <button
        tabIndex={0}
        role="button"
        aria-label={title}
        aria-details="my project"
        aria-describedby="text"
        aria-labelledby="text"
        id="project"
        onClick={() => window.open(link)}
        className="aspect-video text-3xl font-regular underline h-full w-full rounded-[3.4rem]"
      >
        <div
          id="text"
          className="rounded-full bg-[rgba(8,8,8,0.4)] flex justify-between items-center m-4 absolute bottom-0 left-0 z-10 w-[91%] p-5 lg:opacity-0"
        >
          <h2 className="text-color">{title}</h2>
          <BsArrowUpRightCircle className="text-color" />
        </div>
        <Image
          unoptimized
          loading="lazy"
          width={1920}
          height={1080}
          quality={100}
          id="image"
          src={image}
          alt={title}
          className={`rounded-[3.4rem] w-full lg:aspect-video h-full ${
            left ? "object-left-top object-cover" : "object-cover"
          }`}
        />
      </button>
    </motion.div>
  );
}
