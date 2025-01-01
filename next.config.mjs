/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['aigekko.vercel.app'], // Add the hostname here
    },
};

export default nextConfig; // Use ES module export
