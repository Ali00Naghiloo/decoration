// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { satoshiFont, yekanFont } from "@/app/fonts"; // Adjust path if needed
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
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${satoshiFont.variable} ${yekanFont.variable}`}
      suppressHydrationWarning={true}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
