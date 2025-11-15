"use client";

import { useTranslation } from "@/src/hooks/useTranslation";
import { Badge } from "../ui/badge";
import SampleCard from "./SampleCard";
import { useEffect, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { apiFetch } from "@/src/lib/api";
import { useLocale } from "next-intl";

type MaybeTranslated = string | { fa?: string; en?: string };

interface PortfolioItem {
  _id: string;
  title: MaybeTranslated;
  description?: MaybeTranslated;
  des?: MaybeTranslated;
  category?: string;
  cover?: string;
}

export default function Samples() {
  const { t } = useTranslation();
  const locale = useLocale() || "fa";
  const [samples, setSamples] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // normalize locale ("fa-IR" or "en-US" => "fa" | "en") before sending to API
    const normalizedLocale = (locale as string).toString().startsWith("fa")
      ? "fa"
      : "en";

    // ask backend for items in the current locale; backend will also include `translations`
    apiFetch(`/samples?locale=${normalizedLocale}`).then(({ data }) => {
      try {
        // debug: inspect returned shape to ensure translations exist and localized fields are set
        // eslint-disable-next-line no-console
        console.log("[Samples] fetched", {
          normalizedLocale,
          isArray: Array.isArray(data),
          firstItem: Array.isArray(data) && data.length > 0 ? data[0] : data,
        });
      } catch (e) {
        // ignore
      }

      if (Array.isArray(data)) {
        setSamples(data as PortfolioItem[]);
      }
      setLoading(false);
    });
  }, [locale]);

  return (
    <div id="samples" className="flex flex-col items-center gap-5 py-10">
      <div className="w-full flex gap-8 flex-wrap py-5 lg:p-20">
        {loading && (
          <div className="w-full flex justify-center text-gray-400">
            {t("loading-samples")}
          </div>
        )}
        {!loading && samples.length === 0 && (
          <div className="w-full flex justify-center text-gray-400">
            {t("no-samples-found")}
          </div>
        )}
        {samples.map((sm) => (
          <Link
            key={sm._id}
            href={`/samples/${sm._id}`}
            className="cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            <SampleCard
              id={sm._id}
              title={
                (sm as any).translations?.title ??
                (typeof sm.title === "string"
                  ? { fa: sm.title, en: "" }
                  : sm.title)
              }
              category={sm.category || ""}
              cover={sm.cover}
              description={
                (sm as any).translations?.description ??
                (typeof sm.description === "string"
                  ? { fa: sm.description, en: "" }
                  : sm.description)
              }
              des={
                (sm as any).translations?.des ??
                (typeof sm.des === "string" ? { fa: sm.des, en: "" } : sm.des)
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
