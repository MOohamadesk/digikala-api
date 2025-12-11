module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        IRyekan: ["IRyekan", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};