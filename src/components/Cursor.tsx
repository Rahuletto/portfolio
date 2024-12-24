import { useEffect, useState } from "react";
import {motion} from "motion/react"
import { tw } from "../../twind/twind";
import { FaAt } from "react-icons/fa6";
import { AiFillSmile } from "react-icons/ai";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isSmiley, setIsSmiley] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRed, setIsRed] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnterButton = (event: MouseEvent) => {
      setIsHoveringButton(true);
      const target = event.target as HTMLElement;
      const border = window.getComputedStyle(target).borderColor;
      if (border === "rgb(255, 98, 101)") setIsRed(true);
      setTextHeight(0); // Reset text height when hovering over a button
    };

    const handleSmiley = () => {
      setIsSmiley(true);
      setIsHoveringButton(true);
      setTextHeight(0); // Reset text height when hovering over a button
    };

    const handleMouseLeaveButton = () => {
      setIsHoveringButton(false);
      setIsRed(false);
    };

    const handleLeaveSmiley = () => {
      setIsSmiley(false);
      setIsHoveringButton(false);
      setIsRed(false);
    };

    const handleMouseEnterText = (event: Event) => {
      if (!isHoveringButton) { // Only set text height if not hovering over a button
        const target = event.target as HTMLElement;
        const lineHeight = parseFloat(
          window.getComputedStyle(target).lineHeight,
        );
        setTextHeight(lineHeight);
      }
    };

    const handleMouseLeaveText = () => {
      if (!isHoveringButton) { // Only reset text height if not hovering over a button
        setTextHeight(0);
      }
    };

    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("dragend", handleDragEnd);

    document.querySelectorAll("button").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterButton);
      el.addEventListener("mouseleave", handleMouseLeaveButton);
    });

    document.querySelectorAll("img#marban").forEach((el) => {
      el.addEventListener("mouseenter", handleSmiley);
      el.addEventListener("mouseleave", handleLeaveSmiley);
    });

    document.querySelectorAll("a").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterButton);
      el.addEventListener("mouseleave", handleMouseLeaveButton);
    });

    document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span").forEach(
      (el) => {
        el.addEventListener("mouseenter", handleMouseEnterText);
        el.addEventListener("mouseleave", handleMouseLeaveText);
      },
    );

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("dragend", handleDragEnd);

      document.querySelectorAll("button").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterButton);
        el.removeEventListener("mouseleave", handleMouseLeaveButton);
      });
      document.querySelectorAll("a").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterButton);
        el.removeEventListener("mouseleave", handleMouseLeaveButton);
      });
      document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span").forEach(
        (el) => {
          el.removeEventListener("mouseenter", handleMouseEnterText);
          el.removeEventListener("mouseleave", handleMouseLeaveText);
        },
      );
    };
  }, [isHoveringButton]);

  return (
    <motion.div

      className={tw(
        `hidden fixed top-0 left-0 lg:flex items-center justify-center shadow-lg pointer-events-none rounded-full backdrop-blur-sm`,
      )}
      style={{
        willChange: "transform, width, height, background, border",
        zIndex: 9999,
        height: isHoveringButton
          ? "40px"
          : textHeight
          ? `${textHeight}px`
          : "20px",
        width: isHoveringButton ? "40px" : textHeight ? "6px" : "20px",
        transform: `translate3d(${
          position.x - (isHoveringButton ? 20 : textHeight ? 3 : 10)
        }px, ${
          position.y -
          (isHoveringButton ? 20 : textHeight ? textHeight / 2 : 10)
        }px, 0)`,
        background: textHeight
          ? "#FBFAF47E"
          : isHoveringButton
          ? "#171717AE"
          : isClicking
          ? "transparent"
          : "#FBFAF4AE",
        border: isHoveringButton || textHeight
          ? "none"
          : isClicking
          ? "5px solid #FBFAF4AE"
          : isDragging
          ? "2px dashed #000"
          : "none",
      }}
      animate={{
        x: position.x - (isHoveringButton ? 20 : textHeight ? 3 : 10),
        y: position.y -
          (isHoveringButton ? 20 : textHeight ? textHeight / 2 : 10),
        height: isHoveringButton
          ? "40px"
          : textHeight
          ? `${textHeight}px`
          : "20px",
        width: isHoveringButton ? "40px" : textHeight ? "6px" : "20px",
        scale: isClicking ? 0.9 : isDragging ? 1.2 : 1,
        background: textHeight
          ? "#FBFAF47E"
          : isHoveringButton
          ? "#171717AE"
          : isClicking
          ? "transparent"
          : "#FBFAF4AE",
      }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.8, 0.25, 1],
      }}
    >
      {isHoveringButton && (
        isSmiley ? <AiFillSmile className={tw(`text-color text-3xl`)} /> : (
          isRed
            ? <FaAt className={tw(`${isRed ? "text-red" : "text-color"}`)} />
            : (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={tw(`text-xl ${isRed ? "text-red" : "text-color"}`)}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ x: 0, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </motion.svg>
            )
        )
      )}
    </motion.div>
  );
};

export default CustomCursor;
