import withPWAInit from "@ducanh2912/next-pwa";
/** @type {import('next').NextConfig} */

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = {
    reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io', // Your external image hostname
        port: '',
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default withPWA(nextConfig);