import { type ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function Works({ children }: Props) {
  return (
    <div className="flex flex-col items-center gap-12 mt-92 max-w-6xl w-full px-8 mx-auto pb-48 pointer-events-auto">
      <div className="px-6 py-4 bg-dark">
        <h2 className="text-5xl leading-none font-medium text-white tracking-tight relative z-10">
          Works
        </h2>
      </div>

      <div className="grid grid-cols-6 gap-6 w-full auto-rows-[220px]">
        <div className="bg-light rounded-3xl col-span-2 row-span-2 " />
        <div className="bg-light rounded-3xl col-span-3 row-span-1 " />
        <div className="bg-light rounded-3xl col-span-1 row-span-2 " />
        <div className="bg-light rounded-3xl col-span-3 row-span-2 " />
        <div className="bg-light rounded-3xl col-span-2 row-span-1 " />
        <div className="bg-light rounded-3xl col-span-1 row-span-1 " />
      </div>

      {children}
    </div>
  );
}
