"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

export default function Loading() {
  const params = useParams() as { locale?: string };
  const locale = params?.locale?.toString().startsWith("en") ? "en" : "fa";

  const text = {
    en: { loading: "Loading...", pleaseWait: "Please wait" },
    fa: { loading: "در حال بارگذاری...", pleaseWait: "لطفا صبر کنید" },
  } as const;

  const t = text[locale];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 z-50">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-28 h-28 rounded-full overflow-hidden bg-white/80 p-3 shadow-lg flex items-center justify-center"
          aria-hidden="true"
        >
          <Image src="/logo.svg" alt="logo" width={88} height={88} />
        </div>

        <div className="text-gray-700 text-lg font-medium tracking-wide animate-pulse">
          {t.loading}
        </div>

        <div className="mt-2 text-sm text-gray-500">{t.pleaseWait}</div>

        <span className="sr-only" role="status" aria-live="polite">
          {t.loading}
        </span>
      </div>
    </div>
  );
}
