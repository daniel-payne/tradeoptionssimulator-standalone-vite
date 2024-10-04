/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        pricesimulator: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          ...require("daisyui/src/theming/themes")["business"],
          //OVERRIDES
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          //COLORS
        },
      },
      "business",
    ],
  },
  safelist: [
    "h-auto",
    "h-full",
    "h-1/2",
    "h-1/3",
    "h-1/4",
    "h-1/5",
    "h-1/6",
    "h-40",
    "h-48",
    "h-80",
    "h-96",
    "w-auto",
    "w-full",
    "w-1/2",
    "w-1/3",
    "w-1/4",
    "w-1/5",
    "w-1/6",
    "w-40",
    "w-48",
    "w-80",
    "w-96",
    // { pattern: /h-.*/ },
    // { pattern: /w-.*/ },
  ],
}
