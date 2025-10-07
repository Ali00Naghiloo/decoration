import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { satoshiFont, yekanFont } from "../fonts";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

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
  setRequestLocale(locale);
  const messages = useMessages();

  return (
    <html>
      <body
        dir={locale === "fa" ? "rtl" : "ltr"}
        className={`${satoshiFont.variable} ${yekanFont.variable} w-full h-full`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
