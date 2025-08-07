import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thorn Bird Books",
  description: "Your premier online bookstore for all genres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
