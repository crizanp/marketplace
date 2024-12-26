/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // Enable static export
  exportTrailingSlash: true, // Ensure trailing slash on URLs
  images: {
    unoptimized: true, // Disable image optimization for export
  },
};

export default nextConfig;
