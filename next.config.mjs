/** @type {import('next').NextConfig} */

const config = {
  output: 'export',
  poweredByHeader: false,
  swcMinify: true,
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
  },
  compress: true,
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
}

export default config;