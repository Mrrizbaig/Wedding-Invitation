import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F0E5',
          light: '#FAF5EE',
          dark: '#EDE0CC',
        },
        burgundy: {
          DEFAULT: '#5A1822',
          dark: '#351016',
          light: '#7A2030',
        },
        rose: {
          muted: '#9D5A60',
          light: '#B87880',
        },
        gold: {
          champagne: '#C9A45C',
          light: '#D9B870',
          dark: '#A88040',
        },
        brown: {
          warm: '#4A332B',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        script: ['Great Vibes', 'cursive'],
        amiri: ['Amiri', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'slide-up': 'slideUp 0.9s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
