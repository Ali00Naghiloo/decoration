"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe } from "lucide-react";
import i18nConfig from "@/src/i18nConfig";
import { useCurrentLocale } from "next-i18n-router/client";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useCurrentLocale(i18nConfig);

  // Simple toggle logic
  const nextLocale = currentLocale === "en" ? "fa" : "en";

  // This logic is needed to swap the locale in the path
  const redirectedPathName = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <Link
      href={redirectedPathName(nextLocale)}
      className="flex items-center gap-2 font-semibold"
    >
      <Globe className="h-5 w-5" />
      <span>{nextLocale.toUpperCase()}</span>
    </Link>
  );
}
