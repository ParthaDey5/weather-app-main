/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],

  darkMode: "media",

  theme: {
    extend: {
      screens
      : {
        desktop: "855px",
      },
      cursor: {
        pointer: "url('/icons/cursor.png'), pointer",
      },
      colors: {
        Neutral900: "hsl(243, 96%, 9%)",
        Neutral800: "hsl(243, 27%, 20%)",
        Neutral700: "hsl(243, 23%, 24%)",
        Neutral600: "hsl(243, 23%, 30%)",
        Neutral300: "hsl(240, 6%, 70%)",
        Neutral200: "hsl(250, 6%, 84%)",
        Neutral0: "hsl(0, 0%, 100%)",
        Orange500: "hsl(28, 100%, 52%)",
        Blue500: "hsl(233, 67%, 56%)",
        Blue700: "hsl(248, 70%, 36%)",
      },
      fontSize: {
        base: "18px",
      },
      fontFamily: {
        dm: ["DM Sans", "sans-serif"],
        brico: ["Bricolage Grotesque", "sans-serif"],
      },
      keyframes: {
        bounce: {
          '0%': { transform: 'translateY(0)', opacity: '0.6' },
          '100%': { transform: 'translateY(-10px)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        bounce: 'bounce 0.6s infinite alternate',
        'fade-in': 'fade-in 1s ease forwards',
      },
      
    },
  },

  plugins: [],
};
