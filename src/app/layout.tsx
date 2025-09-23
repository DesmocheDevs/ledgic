import "reflect-metadata";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://ledgic.com"),
  title: {
    default: "Ledgic | Ecosistema para MiPymes",
    template: "%s | Ledgic",
  },
  description:
    "Ledgic es un ecosistema de crecimiento para MiPymes: define costes, colabora con otras empresas y potencia tu negocio.",
  applicationName: "Ledgic",
  generator: "Next.js",
  keywords: [
    "Ledgic",
    "MiPyme",
    "costeo",
    "colaboración",
    "negocios",
    "ecosistema",
    "pymes",
    "gestión empresarial",
  ],
  authors: [
    { name: "DesmocheDevs", url: "https://ledgic.com" },
    { name: "Equipo Ledgic" },
  ],
  creator: "DesmocheDevs",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#042257" },
    ],
  },
  openGraph: {
    title: "Ledgic | Ecosistema para MiPymes",
    description:
      "Gestiona costes, colabora y haz crecer tu pyme con Ledgic.",
    url: "https://ledgic.com",
    siteName: "Ledgic",
    images: [
      {
        url: "/opengraph.jpeg",
        width: 1200,
        height: 630,
        alt: "Ledgic - Ecosistema para MiPymes",
      },
    ],
    locale: "es_ES",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Helvetica.variable} ${OpenSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}