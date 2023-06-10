/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['https://opensea.io/', 'https://ipfs.io/', 'ik.imagekit.io'],
  },
};

module.exports = nextConfig;
