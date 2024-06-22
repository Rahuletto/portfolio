import { DeviceProvider } from "@/provider/DeviceProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import {Inter} from 'next/font/google'

const inter = Inter({
  fallback: ['sans-serif'],
  weight: ['500', '600'],
  display: 'swap',
  style: ['normal'],
  subsets: ['latin'],
  variable: '--main-font',
});

const helv = localFont({
  variable: '--root-font',
  display: 'swap',
  fallback: ['sans-serif'],
  src: [
    {
      path: "fonts/HelveticaNeueBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "fonts/HelveticaNeueBoldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "fonts/HelveticaNeueMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "fonts/HelveticaNeueMediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "fonts/HelveticaNeueHeavy.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "fonts/HelveticaNeueHeavyItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DeviceProvider>
      <style jsx global>
        {`
          html {
              --root-font: ${helv.style.fontFamily};
              --inter: ${inter.style.fontFamily};
            }
        `}
      </style>
      <main className={helv.className}>
        <Component {...pageProps} />
      </main>
    </DeviceProvider>
  );
}
