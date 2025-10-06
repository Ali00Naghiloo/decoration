"use client";

import { useTranslation } from "@/src/hooks/useTranslation";
import { Badge } from "../ui/badge";
import SampleCard from "./SampleCard";
import { SampleTypes } from "@/src/types/sample.types";

export default function Samples() {
  const { t } = useTranslation();

  const samples: SampleTypes[] = [
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
    {
      title: "Hitachi Hits 5x More Connects in 30 Days with TitanX",
      category: "Industrial / Manufacturing",
    },
  ];

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
          {samples.map((sm) => (
            <SampleCard
              key={Math.random().toString(36).substring(7)}
              title={sm.title}
              category={sm.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
