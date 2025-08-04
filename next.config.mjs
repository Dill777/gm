/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "4ynfpbck9li3qlrs.public.blob.vercel-storage.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ek65wlrwd0szvdez.public.blob.vercel-storage.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "zns-metadata.s3.eu-north-1.amazonaws.com",
        port: "",
      },
    ],
  },
};
export default nextConfig;
