"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Determine the next locale
  const nextLocale = locale === "en" ? "fa" : "en";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className="font-semibold text-gray-300 hover:text-white transition-colors"
    >
      {nextLocale.toUpperCase()}
    </Link>
  );
}
