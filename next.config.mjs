import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/es/docs',
        destination: '/es',
        permanent: true,
      },
      {
        source:
          '/es/docs/conectar-plataformas/meta-ads/activos-opcionales',
        destination:
          '/es/docs/conectar-plataformas/meta-ads/activos-digitales',
        permanent: true,
      },
      {
        source:
          '/en/docs/conectar-plataformas/meta-ads/activos-opcionales',
        destination:
          '/en/docs/conectar-plataformas/meta-ads/activos-digitales',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);
