import { NextIntlClientProvider, useMessages } from "next-intl";
import { satoshiFont, yekanFont } from "../fonts";
import { setRequestLocale } from "next-intl/server";
// REMOVE this import: import {unstable_setRequestLocale} from 'next-intl/server';

// This function is now the key. It tells next-intl which locales to build.
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
    <div
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${satoshiFont.variable} ${yekanFont.variable} w-full h-full`}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
