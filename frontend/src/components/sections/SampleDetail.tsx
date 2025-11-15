"use client";

import "plyr-react/plyr.css";
import MediaSlider, { MediaItem } from "@/src/components/forms/MediaSlider";
import { Button } from "../ui/button";
import { Link } from "@/src/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Video } from "@/src/components/ui/video";
import { satoshiFont, yekanFont } from "@/app/fonts";

type TranslatedString = string | { fa?: string; en?: string };

export interface PortfolioItem {
  _id: string;
  title: TranslatedString;
  cover?: string;
  description?: TranslatedString;
  des?: TranslatedString;
  images?: string[];
  mediaUrl?: string;
  mediaType?: string[];
  videoUrl?: string;
  category?: string;
  lang?: "fa" | "en";
  translations?: {
    title?: { fa?: string; en?: string };
    description?: { fa?: string; en?: string };
    des?: { fa?: string; en?: string };
  };
}

export default function SampleDetailSection({ item }: { item: PortfolioItem }) {
  const media: MediaItem[] = [];
  if (item.images && item.images.length > 0)
    media.push(...item.images.map((url) => ({ type: "image" as const, url })));
  if (item?.videoUrl) media.push({ type: "video", url: item?.videoUrl });
  else if (item.cover) media.push({ type: "image", url: item.cover });

  const { t } = useTranslation();
  const locale = (useLocale() || "fa") as "fa" | "en";

  const pickTranslated = (val?: TranslatedString) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val[locale] ?? val.fa ?? val.en ?? "";
  };

  // Title / description / summary selection
  // Prefer translations object (managed in panel/backend) when available,
  // otherwise fall back to top-level fields (legacy support).
  const displayTitle = item.translations?.title
    ? pickTranslated(item.translations.title)
    : pickTranslated(item.title);

  const displayDes = item.translations?.des
    ? pickTranslated(item.translations.des)
    : pickTranslated(item.des);

  // description may be HTML string (legacy) or an object. Prefer translations if present.
  const descriptionHtml = (() => {
    const descSource = item.translations?.description ?? item.description;
    if (!descSource) return "";
    if (typeof descSource === "string") return descSource;
    return pickTranslated(descSource);
  })();

  // Determine language for fonts / dir attribute: prefer explicit item.lang, fall back to current locale
  const displayLang = item.lang || locale;
  const fontClass =
    displayLang === "fa" ? yekanFont.className : satoshiFont.variable;

  return (
    <div
      className={`flex flex-col ${fontClass}`}
      lang={displayLang}
      dir={displayLang === "fa" ? "rtl" : "ltr"}
    >
      <div className="w-full flex flex-col lg:flex-row justify-between items-center lg:h-[90vh]">
        <div className="w-full lg:w-4/10 h-full flex flex-col justify-around px-8 gap-10">
          <div className="w-fit">
            <Link href={"/"}>
              <Button variant="link" className="mb-auto">
                <ChevronLeft fontSize="1.25rem" />
                {t("back")}
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl lg:text-5xl text-center lg:min-h-[300px]">
            {displayTitle}
          </h1>
          <div />
        </div>

        <div className="w-full lg:w-6/10 h-1/2 min-h-[300px] px-5 lg:px-10">
          <MediaSlider media={media} />
        </div>
      </div>

      <div className="max-w-[900px] mx-auto flex flex-col gap-5 px-5 py-10">
        {item.videoUrl && (
          <div className="hidden w-full h-fit my-10 rounded-3xl">
            <Video
              src={item.videoUrl}
              poster={item.cover}
              autoPlay
              muted
              loop
            />
          </div>
        )}

        {descriptionHtml && (
          <div
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            className="richtext text-[18px] text-[#444] mb-6 p-4 rounded"
          />
        )}

        <div className="lg:mb-48 mb-10 flex gap-4 items-center">
          <span className="mr-4">{t("share")}</span>
          {[
            {
              name: "Facebook",
              url: "https://facebook.com",
              icon: "/icons/facebook.svg",
            },
            {
              name: "Instagram",
              url: "https://instagram.com",
              icon: "/icons/instagram.svg",
            },
            {
              name: "Twitter",
              url: "https://twitter.com",
              icon: "/icons/x.svg",
            },
            {
              name: "LinkedIn",
              url: "https://linkedin.com",
              icon: "/icons/linkedin.svg",
            },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              className="bg-[#F8F8F8] rounded-full p-2 flex justify-center items-center"
              rel="noopener noreferrer"
            >
              <Image
                src={social.icon}
                alt={social.name}
                className="w-5 h-5 brightness-0"
                width={24}
                height={24}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
