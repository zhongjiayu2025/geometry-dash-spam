import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Geometry Dash Spam Test',
    short_name: 'GD Spam',
    description: 'Ultimate Wave Simulator and CPS Test for Geometry Dash players.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}