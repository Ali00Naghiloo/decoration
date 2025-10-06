// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Interior Design Portfolio",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fa" }];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="antialiased">{children}</body>
    </html>
  );
}
