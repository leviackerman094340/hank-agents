/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['@heroui/react'] },
  turbopack: { root: __dirname },
}
module.exports = nextConfig
