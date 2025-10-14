import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import SmoothScroller from "../../src/components/layout/SmoothScroller";
import { satoshiFont, yekanFont } from "../fonts";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نگارستان | Negarestan",
  description:
    "خدمات جامع طراحی و اجرای معماری ساختمان‌های لوکس، نقاشی، پتینه، دکوراسیون داخلی و طراحی لباس اختصاصی برای بانوان. سرعت بالا، قیمت مناسب و کار منحصر به فرد را تجربه کنید.",
  openGraph: {
    title: "هنر معماری و فشن: طراحی، اجرا و دوخت‌های یونیک",
    description:
      "خدمات جامع طراحی و اجرای معماری ساختمان‌های لوکس، نقاشی، پتینه، دکوراسیون داخلی و طراحی لباس اختصاصی برای بانوان. سرعت بالا، قیمت مناسب و کار منحصر به فرد را تجربه کنید.",
  },
  twitter: {
    title: "هنر معماری و فشن: طراحی، اجرا و دوخت‌های یونیک",
    description:
      "خدمات جامع طراحی و اجرای معماری ساختمان‌های لوکس، نقاشی، پتینه، دکوراسیون داخلی و طراحی لباس اختصاصی برای بانوان. سرعت بالا، قیمت مناسب و کار منحصر به فرد را تجربه کنید.",
  },
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
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <head>
        <title>نگارستان | Negarestan</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
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
