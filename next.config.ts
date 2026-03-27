import type { NextConfig } from 'next';

// @ts-expect-error: a biblioteca next-pwa não possui tipagem nativa atualizada
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Desativa no modo dev para não atrapalhar o hot-reload
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Outras configurações do Next.js entrarão aqui no futuro
};

export default withPWA(nextConfig);