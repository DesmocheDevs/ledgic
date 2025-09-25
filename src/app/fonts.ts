import localFont from "next/font/local";

export const Helvetica = localFont({
  src: [
    { path: "./fonts/Helvetica.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Helvetica.woff", weight: "400", style: "normal" },
    { path: "./fonts/Helvetica.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

export const OpenSans = localFont({
  src: [
    { path: "./fonts/OpenSans.woff2", weight: "400", style: "normal" },
    { path: "./fonts/OpenSans.woff", weight: "400", style: "normal" },
    { path: "./fonts/OpenSans.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-opensans",
  display: "swap",
});