import { setup, tw } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";

setup({
  theme: {
    extend: {
      colors: {
        background: "#0C0C0C",
        backgroundLight: "#171717",
        color: "#EBE9E2",
        colorLight: "#FBFAF4",
        red: "#FF6265",
      },
    }
  },
  presets: [
    presetAutoprefix(),
    presetTailwind(),
  ],
});

export {tw}