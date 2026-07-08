/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Standard JWKS discovery path. Next 14 app router can't route
      // dot-prefixed folders, so the handler lives at /api/jwks.
      { source: "/.well-known/jwks.json", destination: "/api/jwks" },
    ];
  },
};

export default nextConfig;
