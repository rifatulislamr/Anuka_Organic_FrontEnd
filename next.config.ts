import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'anukabd.com',
      },
      {
        protocol: 'https',
        hostname: 'endpoints.anukabd.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig