/** @type {import('next').NextConfig} */
import withOptimizedImages from "next-optimized-images";

const config = withOptimizedImages({
  handleImages: ["svg", 'png', 'webp'],
  optimizeImages: true,
  optimizeImagesInDev: true,
  images: {
    disableStaticImages: true,
    formats: ['image/webp'],
    unoptimized: true,
  },
  output: "export",
  poweredByHeader: false,
  swcMinify: true,
  reactStrictMode: true,
  compress: true,
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
});

export default config;