import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import SmoothScroller from "../../src/components/layout/SmoothScroller";
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
  console.log(locale);

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <body
        className={`${locale === "fa" && yekanFont.className}
        } ${locale === "en" && satoshiFont.variable}`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScroller>{children}</SmoothScroller>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
