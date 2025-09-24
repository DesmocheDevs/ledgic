import "reflect-metadata";
import type { Metadata } from "next";
import { Helvetica, OpenSans } from "./fonts";
import "./globals.css";

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