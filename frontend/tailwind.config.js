module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui','@tailwindcss/forms'),
  ],
  daisyui: {
    themes: ["corporate", "synthwave", "aqua", "winter", "valentine", "retro", "cyberpunk"],
  },
};
