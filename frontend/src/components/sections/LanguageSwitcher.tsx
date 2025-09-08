"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    // Update the URL with the new locale
    const segments = pathname.split("/");
    segments[1] = newLocale; // assumes your routes are like /en/... /de/...
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("en")}
        disabled={locale === "en"}
        className="px-3 py-1 rounded border"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("fa")}
        disabled={locale === "fa"}
        className="px-3 py-1 rounded border"
      >
        فارسی
      </button>
    </div>
  );
}
