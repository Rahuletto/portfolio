import { type ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function Works({ children }: Props) {
  return (
    <div className="flex flex-col items-center relative gap-12 mt-92 z-20 max-w-6xl w-full px-8 mx-auto pb-48 pointer-events-none">
      <div className="flex justify-start items-center gap-8 w-full pointer-events-auto">
        <h2 className="text-5xl leading-none text-left font-medium text-light relative z-10">
          Works
        </h2>
        <div className="w-full h-0.5 mt-2 rounded-full bg-light" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 w-full auto-rows-[220px] pointer-events-auto">
        <div className="bg-light/10 14px rounded-[32px] border border-white/10 col-span-2 lg:col-span-2 row-span-1 lg:row-span-2" />
        <div className="bg-light/10 14px rounded-[32px] border border-white/10 col-span-2 lg:col-span-3 row-span-1" />
        <div className="bg-light/10 14px rounded-[32px] border border-white/10 col-span-1 lg:col-span-1 row-span-1 lg:row-span-2" />
        <div className="bg-light/10 14px rounded-[32px] border border-white/10 col-span-2 lg:col-span-3 row-span-1 lg:row-span-2" />
        <div className="bg-light/10 14px rounded-[32px] border border-white/10 col-span-1 lg:col-span-2 row-span-1" />
        <div className="bg-light/10 14px rounded-[32px] border border-white/10 col-span-1 lg:col-span-1 row-span-1" />
      </div>

      <div className="pointer-events-auto w-full">
        {children}
      </div>
    </div>
  );
}
