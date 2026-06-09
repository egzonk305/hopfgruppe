import "./globals.css";

export const metadata = {
  title: "Hopfgruppe",
  description: "Gruppenprojekt Praktikum 9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}