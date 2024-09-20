/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    textColor: (theme) => theme("colors"),
    textColor: {
      primary: "#F93B1D",
      secondary: " #021526B2",
      danger: "#e3342f",
      white: "#FFFFFF",
      success: "#45A849",
    },
    colors: {
      primary: "#F93B1D",
      secondary: " #021526B2",
      danger: "#e3342f",
      gray: "#DBDBDB",
      white: "#FFFFFF",
      dark: "#DF3014",
      success: "#45A849",
    },
  },
  plugins: [],
};
