const colors = require("tailwindcss/colors");
delete colors["lightBlue"];
delete colors["warmGray"];
delete colors["trueGray"];
delete colors["coolGray"];
delete colors["blueGray"];

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      color: {
        gray: {
          ...colors.gray,
          50: "#FAFAFA",
          100: "#E7E7E7",
          500: "#9a96a3",
          700: "#242526",
          800: "#191A1B",
          900: "#0c0c0c",
        },
        pink: {
          50: colors.pink["50"],
          100: "#FED8E2",
          200: "#FDB1C6",
          300: "#FD89A9",
          400: "#FC628D",
          500: "#FB3B70",
          600: "#C92F5A",
          700: "#972343",
          800: "#64182D",
          900: "#320C16",
        },
      },
    },
    colors: {
      ...colors,
      blue: {
        primary: "#10083B",
      },
      emerald: {
        primary: "#00FFAE",
      },
      purple: {
        primary: "#5025FA",
        second: "#ADB9D8",
        900: "#312e81",
      },
    },
  },
  plugins: [],
};
