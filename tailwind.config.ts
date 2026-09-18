import { type Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{html,ts}", // Make sure Angular files are scanned
  ],
  theme: {
    extend: {
      rotate: {
        '10': '10deg',
        '-10': '-10deg',
        '180': '180deg'
      },
      colors: {
        border: "#563b3bff",
        primary: "#41aecfff", // Example: Indigo-500
        accent: "#606060ff",  // Example: Pink-500
        'accent-glow': "#15037bff", // Glow color
        background: "#000000ff", 
        foreground: "#ffffffff",
        'muted-foreground': "#94a3b8",
      },
      animation: {
        marquee: 'marquee 8s linear infinite',
        'pulse-slow': 'pulse 5s infinite',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // 2x content so -50%
        },
      },
    },
  },
  plugins: [],
};
export default config;
