import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2255E7", // blue-600
          hover: "#1B45BC", // blue-700
          pressed: "#163A9E", // blue-800
          100: "#D7E2FC",
          50: "#EEF3FE",
        },
        ink: {
          DEFAULT: "#0E1526",
          70: "#3A4459",
          50: "#6B7488",
        },
        line: {
          DEFAULT: "#E3E7EF",
          strong: "#C9D0DE",
        },
        surface: "#FFFFFF",
        canvas: "#F7F9FC",
        success: { DEFAULT: "#0E7C4F", bg: "#E7F4EE" },
        warning: { DEFAULT: "#B26A00", bg: "#FDF3E2" },
        danger: { DEFAULT: "#C1362F", bg: "#FCEDEC" },
      },
      fontFamily: {
        heading: ["var(--font-poppins)"],
        body: ["var(--font-ibm-plex)"],
      },
    },
  },
  plugins: [],
};

export default config;
