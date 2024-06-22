import { DeviceProvider } from "@/provider/DeviceProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DeviceProvider>
      <Component {...pageProps} />
    </DeviceProvider>
  );
}
