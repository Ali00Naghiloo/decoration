"use client";

import { useTranslation } from "@/src/hooks/useTranslation";
import { Badge } from "../ui/badge";
import SampleCard from "./SampleCard";
import { useEffect, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { apiFetch } from "@/src/lib/api";

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
  const [samples, setSamples] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/samples").then(({ data }) => {
      if (Array.isArray(data)) {
        setSamples(data);
      }
      setLoading(false);
    });
  }, []);

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
              title={sm.title}
              category={sm.category || ""}
              cover={sm.cover}
              description={sm.description}
              des={sm.des}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
