import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { satoshiFont } from "@/app/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Interior Design Portfolio",
  description: "Showcasing beautiful interior designs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The check for a valid locale has been REMOVED from here.

  const messages = useMessages();

  return (
    <html className={satoshiFont.variable}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
