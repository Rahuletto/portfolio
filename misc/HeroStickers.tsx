import { getRandomDelay } from "@/utils/random";
import { useDevice } from "@/provider/DeviceProvider";
import dynamic from "next/dynamic";

const Sticker = dynamic(() => import("@/misc/Sticker").then((a) => a.default), {
  ssr: false,
});


function HeroStickers({ noanim }: { noanim?: boolean }) {
  const device = useDevice();

  return (
    <>
      {device === "desktop" ? (
        <>
          <Sticker
            noanim={noanim}
            id={1}
            delay={2 + getRandomDelay()}
            className={`absolute`}
            style={{ top: "-3vh", left: "140px" }}
            scale={device === "desktop" ? 1.3 : 0.8}
          />
          <Sticker
            noanim={noanim}
            id={2}
            delay={2 + getRandomDelay()}
            className="absolute z-10"
            style={{ bottom: -20, left: 100 }}
            scale={device === "desktop" ? 1.5 : 0.9}
          />
          <Sticker
            id={3}
            noanim={noanim}
            delay={2 + getRandomDelay()}
            className="absolute top-[2vh] z-10"
            style={{ right: "4vw" }}
            scale={device === "desktop" ? 1.2 : 0.6}
          />
          <Sticker
            noanim={noanim}
            id={4}
            delay={2 + getRandomDelay()}
            className="absolute z-10"
            style={{ top: "50%", right: "17vw" }}
            scale={device === "desktop" ? 1.5 : 0.79}
          />
        </>
      ) : device === "tablet" ? (
        <>
          <Sticker
            mobile
            noanim={noanim}
            id={1}
            delay={2 + getRandomDelay()}
            className={`absolute top-[0vh] left-[70px]`}
            scale={0.8}
          />
          <Sticker
            id={2}
            mobile
            noanim={noanim}
            delay={2 + getRandomDelay()}
            style={{ bottom: "0vh", left: 90 }}
            className="absolute z-10"
            scale={0.9}
          />
          <Sticker
            id={3}
            noanim={noanim}
            mobile
            delay={2 + getRandomDelay()}
            style={{ top: "0vh", right: "12px" }}
            className="absolute z-10"
            scale={0.9}
          />
          <Sticker
            id={4}
            mobile
            noanim={noanim}
            delay={2 + getRandomDelay()}
            style={{ top: "50%", right: "20%" }}
            className="absolute top-[46vh] right-[27vw] z-10"
            scale={0.79}
          />
        </>
      ) : (
        device === "mobile" && (
          <>
            <Sticker
              mobile
              id={1}
              noanim={noanim}
              delay={2 + getRandomDelay()}
              className={`absolute`}
              style={{ top: "-20%", left: "20px" }}
              scale={0.52}
            />

            <Sticker
              noanim={noanim}
              id={3}
              mobile
              delay={2 + getRandomDelay()}
              style={{ top: "-20%", right: "11vw" }}
              className="absolute z-10"
              scale={0.43}
            />
            <Sticker
              id={4}
              noanim={noanim}
              mobile
              delay={2 + getRandomDelay()}
              style={{ top: "158%", right: "-12px" }}
              className="absolute z-10"
              scale={0.56}
            />
          </>
        )
      )}
    </>
  );
}

export default HeroStickers;
