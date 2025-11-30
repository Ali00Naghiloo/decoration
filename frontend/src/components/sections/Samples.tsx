"use client";

import { useTranslation } from "@/src/hooks/useTranslation";
import { Badge } from "../ui/badge";
import SampleCard from "./SampleCard";
import { useEffect, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { apiFetch } from "@/src/lib/api";
import { useLocale } from "next-intl";
import Skeleton from "../ui/Skeleton";
import TextAnimate from "@/src/components/ui/TextAnimate";

interface PortfolioItem {
  _id: string;
  title: string;
  description?: string;
  des?: string;
  category?: string;
  cover?: string;
}

export default function Samples() {
  const { t } = useTranslation();
  // call hook at top-level and derive a stable normalized locale
  const rawLocale = useLocale() || "fa";
  const normalizedLocale = (rawLocale as string).toString().startsWith("fa")
    ? "fa"
    : "en";

  const [samples, setSamples] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ask backend for items in the current normalized locale; backend will include `translations`
    apiFetch(`/samples?locale=${normalizedLocale}`).then(({ data }) => {
      if (Array.isArray(data)) {
        setSamples(data);
      }
      setLoading(false);
    });
  }, [normalizedLocale]);

  return (
    <div id="samples" className="flex flex-col items-center gap-5 py-10">
      <Badge
        className={
          "bg-[rgba(0,111,255,0.04)] text-[#006FFF] px-4 py-2 rounded-[100px]"
        }
      >
        <TextAnimate as="span" by="word">
          {t("customer-stories")}
        </TextAnimate>
      </Badge>

      <div className="font-bold text-4xl xl:text-6xl">
        <TextAnimate as="span" by="word" className="inline-block">
          {t("all-customer")}
        </TextAnimate>{" "}
        <TextAnimate
          as="span"
          by="word"
          className="text-[#006FFF] inline-block"
        >
          {t("stories")}
        </TextAnimate>
      </div>

      <div className="w-full flex gap-8 flex-wrap py-5 lg:p-20">
        {loading && (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-[290px] xl:w-[420px] h-auto mx-auto">
                <Skeleton variant="card" />
              </div>
            ))}
          </>
        )}
        {!loading && samples.length === 0 && (
          <div className="w-full flex justify-center text-gray-400">
            <TextAnimate as="span" by="word">
              {t("no-samples-found")}
            </TextAnimate>
          </div>
        )}
        {samples.map((sm) => (
          <Link
            key={sm._id}
            href={`/samples/${sm._id}`}
            className="cursor-pointer mx-auto md:mx-0"
            style={{ textDecoration: "none" }}
          >
            <SampleCard
              id={sm._id}
              title={
                typeof sm.title === "string"
                  ? { fa: sm.title, en: "" }
                  : sm.title
              }
              category={sm.category || ""}
              cover={sm.cover}
              description={
                typeof sm.description === "string"
                  ? { fa: sm.description, en: "" }
                  : sm.description
              }
              des={typeof sm.des === "string" ? { fa: sm.des, en: "" } : sm.des}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
