import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
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
      // Redirects from old "Configurar Mi Negocio" pages → new overview
      {
        source: '/es/docs/configurar-negocio/brief-audio',
        destination: '/es/docs/configurar-negocio/como-definir-tu-marca',
        permanent: true,
      },
      {
        source: '/es/docs/configurar-negocio/redes-sociales',
        destination: '/es/docs/configurar-negocio/como-definir-tu-marca',
        permanent: true,
      },
      {
        source: '/es/docs/configurar-negocio/revisar-brief',
        destination: '/es/docs/configurar-negocio/como-definir-tu-marca',
        permanent: true,
      },
      {
        source: '/en/docs/configurar-negocio/brief-audio',
        destination: '/en/docs/configurar-negocio/como-definir-tu-marca',
        permanent: true,
      },
      {
        source: '/en/docs/configurar-negocio/redes-sociales',
        destination: '/en/docs/configurar-negocio/como-definir-tu-marca',
        permanent: true,
      },
      {
        source: '/en/docs/configurar-negocio/revisar-brief',
        destination: '/en/docs/configurar-negocio/como-definir-tu-marca',
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
