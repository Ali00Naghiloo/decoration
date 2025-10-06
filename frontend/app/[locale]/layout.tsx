import { NextIntlClientProvider, useMessages } from "next-intl";
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
  // REMOVE this function call: unstable_setRequestLocale(locale);
  const messages = useMessages();

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
