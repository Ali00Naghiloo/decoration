"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "@/src/hooks/TranslationsProvider";

export default function HeroSection() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToSection = (
    sectionId: string,
    headerOffset: number = 80, // Default offset for a fixed header of 80px
    duration: number = 1000 // Default duration of 1 second
  ) => {
    const targetElement = document.getElementById(sectionId);

    if (!targetElement) {
      console.warn(
        `[Scroll Utility]: Element with id "${sectionId}" not found.`
      );
      return;
    }

    const targetPosition =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    const startPosition = window.scrollY;
    const startTime = performance.now();

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animationStep = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeInOutQuad(progress);

      const newPosition =
        startPosition + (targetPosition - startPosition) * easedProgress;
      window.scrollTo(0, newPosition);

      if (elapsedTime < duration) {
        requestAnimationFrame(animationStep);
      }
    };

    requestAnimationFrame(animationStep);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="xl:h-[90vh] flex flex-col gap-6 xl:gap-0 xl:flex-row p-[5%]">
      <div className="h-full w-full xl:w-2/5">
        <div className="h-full flex flex-col gap-6 justify-center xl:max-w-3/4">
          <Badge
            className={
              "bg-[rgba(0,111,255,0.04)] text-[#006FFF] px-4 py-2 rounded-[100px] font-thin"
            }
          >
            {t("customer-stories")}
          </Badge>
          <h1 className="text-4xl xl:text-6xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg">{t("description")}</p>
          <div className="flex gap-2 xl:gap-10 items-center">
            <Button
              onClick={() => scrollToSection("samples", 80, 1000)}
              color="blue"
              variant={"destructive"}
              className="h-fit text-[1.1em] !p-7 flex gap-3 rounded-[8px] !py-2 !pl-5 !pr-2"
            >
              {t("ctaButton")}
              <div
                className={`bg-white h-9 w-9 rounded-[12px] flex items-center justify-center`}
              >
                <ArrowDown color="#000" />
              </div>
            </Button>
            <Button variant="link" className="text-[1.1em] p-3">
              {t("read-story")}
            </Button>
          </div>
        </div>
      </div>

      {/* image */}
      <div className="w-full xl:w-3/5 flex items-center justify-center">
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
