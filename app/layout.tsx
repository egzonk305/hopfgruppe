import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hopfgruppe Shop",
  description:
    "Full-Stack-Gruppenprojekt fuer Praktikum 10 mit Caching, Performance-Optimierung und Deployment-Vorbereitung.",
  openGraph: {
    title: "Hopfgruppe Shop",
    description:
      "Shop-Prototyp mit Produktkatalog, Warenkorb, Benutzer-Dashboard und Prisma-Datenbank.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
