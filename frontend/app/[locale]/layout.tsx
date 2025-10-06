import type { Metadata } from "next";
import { getDictionary } from "@/src/lib/translations";
import { TranslationsProvider } from "@/src/providers/TranslationProvider";
import { satoshiFont, yekanFont } from "@/app/fonts"; // Make sure fonts are imported

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
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      // Add the font variables here
      className={`${satoshiFont.variable} ${yekanFont.variable}`}
      // This is the fix. Add this prop.
      suppressHydrationWarning={true}
    >
      {/* And add the antialiased class to the body */}
      <body className="antialiased">
        <TranslationsProvider dictionary={dictionary}>
          {children}
        </TranslationsProvider>
      </body>
    </html>
  );
}
