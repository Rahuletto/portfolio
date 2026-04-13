import { MeshGradient } from "@mesh-gradient/react";

interface MeshGradientBgProps {
  colors?: [string, string, string, string];
  seed?: number;
}

const MeshGradientBg = ({ colors, seed = 5 }: MeshGradientBgProps) => {
  const finalColors = colors || ["#5D3FD3", "#A389D4", "#C5B0E3", "#D9B3FF"];
  
  return (
    <div className="fixed inset-0 -z-10 bg-dark">
      <MeshGradient
        key={`${seed}-${finalColors.join("-")}`}
        className="w-full h-full"
        options={{
          seed: seed,
          animationSpeed: 3,
          colors: finalColors as any,
        }}
      />
    </div>
  );
};

export default MeshGradientBg;
