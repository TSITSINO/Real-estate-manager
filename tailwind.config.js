/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    textColor: (theme) => theme("colors"),
    textColor: {
      primary: "#F93B1D",
      secondary: "#ffed4a",
      danger: "#e3342f",
      white: "#FFFFFF",
    },
    colors: {
      primary: "#F93B1D",
      gray: "#DBDBDB",
      white: "#FFFFFF",
      dark: "#DF3014",
    },
  },
  plugins: [],
};
