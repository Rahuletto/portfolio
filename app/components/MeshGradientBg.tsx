import { MeshGradient } from "@mesh-gradient/react";
import { useMeshTheme } from "@/context/MeshThemeContext";

const MeshGradientBg = () => {
  const { currentColors, seed } = useMeshTheme();
  
  return (
    <div className="fixed inset-0 -z-10 bg-dark">
      <MeshGradient
        key={`${seed}-${currentColors.join("-")}`}
        className="w-full h-full"
        options={{
          seed: seed,
          animationSpeed: 3,
          colors: currentColors as any,
        }}
      />
    </div>
  );
};

export default MeshGradientBg;
