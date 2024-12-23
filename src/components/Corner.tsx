import { tw } from "../../twind/twind";
import StarSVG from "../svgs/star";

export default function Corner() {
    return (
        <div
            className={tw(
                "flex absolute z-0 lg:py-36 py-24 px-12 max-w-screen-xl w-full h-full flex-col justify-between",
            )}
        >
            <div className={tw("flex justify-between  opacity-40")}>
                <div
                    className={tw(
                        "w-8 h-8 rounded-tl-2xl border-l-4 border-t-4 border-color",
                    )}
                />
                <div
                    className={tw(
                        "w-8 h-8 rounded-tr-2xl border-r-4 border-t-4 border-color",
                    )}
                />
            </div>
            <div className={tw("flex justify-between")}>
                <div
                    className={tw(
                        "w-8 h-8 rounded-bl-2xl border-l-4  opacity-40 border-b-4 border-color",
                    )}
                />
                <StarSVG className="text-5xl rotate-12 text-color" />
            </div>
        </div>
    );
}
