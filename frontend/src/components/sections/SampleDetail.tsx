"use client";

import MediaSlider, { MediaItem } from "@/src/components/forms/MediaSlider";
import { Button } from "../ui/button";
import { Link } from "@/src/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "@/src/hooks/useTranslation";
import Image from "next/image";

export interface PortfolioItem {
  _id: string;
  title: string;
  cover?: string;
  description?: string;
  images?: string[];
  mediaUrl?: string;
  mediaType?: string[];
  videoUrl?: string;
  category?: string;
}

export default function SampleDetailSection({ item }: { item: PortfolioItem }) {
  const media: MediaItem[] = [];
  if (item?.videoUrl) media.push({ type: "video", url: item?.videoUrl });
  if (item.images && item.images.length > 0)
    media.push(...item.images.map((url) => ({ type: "image" as const, url })));
  else if (item.cover) media.push({ type: "image", url: item.cover });
  const { t } = useTranslation();
  console.log(item);

  const socials = [
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
    { name: "Twitter", url: "https://twitter.com", icon: "/icons/x.svg" },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "/icons/linkedin.svg",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* start section */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-0 lg:h-[90vh]">
        <div className="w-full lg:w-4/10 h-full flex flex-col justify-around px-8 gap-10">
          <div className="w-fit">
            <Link href={"/"}>
              <Button variant="link" className="mb-auto">
                <ChevronLeft fontSize="1.25rem" />
                {t("back")}
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl g:text-6xl">{item.title}</h1>
          <div></div>
        </div>
        <div className="w-6/10 h-1/2 px-5 lg:px-10">
          <MediaSlider media={media} />
        </div>
      </div>

      <div className="max-w-[900px] mx-auto flex flex-col gap-5 px-5">
        <div className="w-full">
          {
            <div className="w-full">
              <div className="relative pt-[56.25%] my-10">
                {" "}
                {/* 16:9 aspect ratio */}
                <video
                  src={item.videoUrl}
                  poster={item.cover}
                  controls
                  playsInline
                  loop
                  autoPlay
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg bg-black"
                  aria-label={item.title ?? "video"}
                />
              </div>
            </div>
          }
        </div>

        <div className="w-full rounded-xl bg-[#F8F9FF] border border-[rgb(0,111,255,0.1)] lg:p-10 p-3 flex flex-col gap-4">
          <div className="bg-[rgba(0,111,255,0.4)] px-3 p-2 text-[#006FFF] rounded-full w-fit">
            {t("quote")}
          </div>
          <span className="text-2xl font-bold">
            “We didn’t expect results this fast. TitanX took what we were
            already doing and made it 10x more effective — no retraining, no
            tool switching, just more wins.”
          </span>
          <div className="flex flex-col self-end">
            <span className="text-xl font-bold">Richard Tanaka</span>
            <span>Director of Sales Enablement, Hitachi North America</span>
          </div>
        </div>

        {item.description && (
          <div
            dangerouslySetInnerHTML={{ __html: item.description }}
            className="text-[18px] text-[#444] mb-6 p-4 rounded"
          />
        )}

        <div className="mb-48 flex gap-4 items-center">
          <span className="mr-4">{t("share")}</span>

          {socials.map((social) => (
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
