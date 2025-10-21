import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import SmoothScroller from "../../src/components/layout/SmoothScroller";
import { satoshiFont, yekanFont } from "../fonts";
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <head>
        <title>نگارستان | Negarestan</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${
          locale === "fa" ? yekanFont.className : satoshiFont.variable
        }`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScroller>{children}</SmoothScroller>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
