import type { Metadata } from "next";
import { Blinker } from "next/font/google";
import "./globals.css";

const blinker = Blinker({
  variable: "--font-blinker",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pablo Fonteñez — Diseñador gráfico",
  description: "Portfolio inmersivo de Pablo Fonteñez: branding, redes sociales, banners, video e inteligencia artificial.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${blinker.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
