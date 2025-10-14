"use client";

import { useTranslation } from "@/src/hooks/useTranslation";
import { Badge } from "../ui/badge";
import SampleCard from "./SampleCard";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PortfolioItem {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  cover?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Samples() {
  const { t } = useTranslation();
  const [samples, setSamples] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/samples`)
      .then((res) => res.json())
      .then((data) => setSamples(data?.data || []));
  }, []);

  return (
    <div id="samples" className="">
      <div className="flex flex-col items-center gap-5 py-10">
        <Badge
          className={
            "bg-[rgba(0,111,255,0.04)] text-[#006FFF] px-4 py-2 rounded-[100px]"
          }
        >
          {t("customer-stories")}
        </Badge>

        <div className="font-bold text-4xl xl:text-6xl">
          {t("all-customer")}{" "}
          <span className="text-[#006FFF]">{t("stories")}</span>
        </div>

        <div className="flex gap-8 flex-wrap py-5 lg:p-20 justify-center">
          {samples.length === 0 && (
            <div className="text-gray-400">نمونه‌کاری ثبت نشده است.</div>
          )}
          {samples.map((sm) => (
            <Link
              key={sm._id}
              href={`/fa/sample/${sm._id}`}
              style={{ textDecoration: "none" }}
            >
              <SampleCard
                id={sm._id}
                title={sm.title}
                category={sm.category || ""}
                cover={sm.cover}
                description={sm.description}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
