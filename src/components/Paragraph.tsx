import React, { useEffect, useState } from "react";
import { useTransform, useScroll } from "framer-motion";
import * as m from "motion/react-m"
import { tw } from "../../twind/twind";

interface ParagraphProps {
  text: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ text }) => {
  const { scrollY } = useScroll();
  const words = text.split(" ");
  const [opacityValues, setOpacityValues] = useState<number[]>(
    new Array(words?.length).fill(0.1),
  );
  const transforms = words.map((_, index) => {
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    const start = windowHeight * (1.2 + index * 0.05) / 4;
    const end = windowHeight * (1.2 + index * 0.05) / 3;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(scrollY, [start, end], [0.1, 1]);
  });

  useEffect(() => {
    const unsubscribe = scrollY.on("change", () => {
      const newOpacityValues = transforms.map((transform) => transform.get());
      setOpacityValues(newOpacityValues);
    });

    return () => unsubscribe();
  }, [scrollY, words]);

  return (
    <p
      className={tw(
        'max-w-screen-lg font-semibold z-10 break-words'
      )}
    >
      <span className={tw('inline-block md:w-[200px] w-[100px]')}>&nbsp;</span>
      {words.map((word, index) => (
        word === "{}" ? <><br /><br /></> :
        <m.span
          key={index}
          style={{ opacity: opacityValues[index] }}
          className={tw('inline-block text-2xl md:text-3xl lg:text-4xl mr-2')}
        >
          {word}
        </m.span>
      ))}
    </p>
  );
};

export default Paragraph;
