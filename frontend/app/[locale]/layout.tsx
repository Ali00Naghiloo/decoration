import { TranslationsProvider } from "@/src/hooks/TranslationsProvider";
import { getDictionary } from "@/src/lib/translations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decoration Portfolio",
  description: "Welcome to the portfolio",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <body>
        <TranslationsProvider dictionary={dictionary}>
          {children}
        </TranslationsProvider>
      </body>
    </html>
  );
}
