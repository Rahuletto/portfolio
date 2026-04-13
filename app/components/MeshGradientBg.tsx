import { MeshGradient } from "@mesh-gradient/react";

const MeshGradientBg = () => {
  return (
    <MeshGradient
      className="w-screen h-screen fixed -z-10"
      options={{
        seed: 5,
        animationSpeed: 3,
        colors: ["#5D3FD3", "#A389D4", "#C5B0E3", "#D9B3FF"],
      }}
    />
  );
};

export default MeshGradientBg;
