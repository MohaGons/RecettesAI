/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.licdn.com", "images.unsplash.com", "placehold.co"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
