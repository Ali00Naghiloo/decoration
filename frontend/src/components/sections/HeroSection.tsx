import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function HeroSection() {
  const t = useTranslations("HeroSection");

  return (
    <div className="h-[90vh] flex p-[5%]">
      <div className="h-full w-2/5">
        <div className="h-full flex flex-col gap-6 justify-center max-w-3/4">
          <h1 className="text-6xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg">{t("description")}</p>
          <div className="flex gap-10">
            <Button
              variant={"destructive"}
              className="text-[1.2em] !p-7 flex gap-7"
            >
              {t("ctaButton")}
              <div className="bg-white"></div>
            </Button>
            <Button variant="link" className="text-[1.2em] p-3">
              {t("read-story")}
            </Button>
          </div>
        </div>
      </div>

      {/* image */}
      <div className="w-3/5 flex items-center justify-center">
        <Image
          src="/images/hero-section-image.png"
          alt="Hero Image"
          width={1000}
          height={500}
          className="object-cover w-full h-4/5 rounded-3xl"
        />
      </div>
    </div>
  );
}
