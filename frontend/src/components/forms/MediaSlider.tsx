// src/components/MediaSlider.tsx

"use client";

// مرحله ۱: ایمپورت‌های مستقیم، دقیقا مانند نمونه کد کاری شما
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { NavigationOptions } from "swiper/types";
import Image from "next/image";

// مرحله ۲: ایمپورت مستقیم CSS ها، که ثابت شد کار می‌کند
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from "react";

export interface MediaItem {
  type: "image" | "video";
  url: string;
}

// ما دیگر از next/dynamic استفاده نمی‌کنیم
export default function MediaSlider({ media }: { media: MediaItem[] }) {
  const [loading, setLoading] = React.useState(true);
  // Swiper ref for navigation control
  const swiperRef = React.useRef<SwiperType | null>(null);

  React.useEffect(() => {
    if (media && media.length > 0) {
      setLoading(false);
    }
  }, [media]);

  // معرفی دکمه‌های نویگیشن به Swiper بعد از mount
  React.useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params.navigation &&
      typeof swiperRef.current.params.navigation === "object"
    ) {
      // رفع خطای eslint با فانکشن کمکی و کست امن
      const nav = swiperRef.current.params.navigation;
      if (typeof nav === "object" && nav) {
        (nav as import("swiper/types").NavigationOptions).prevEl =
          ".custom-swiper-prev";
        (nav as import("swiper/types").NavigationOptions).nextEl =
          ".custom-swiper-next";
        swiperRef.current.navigation.init();
        swiperRef.current.navigation.update();
      }
    }
  }, [loading]);

  if (loading) {
    return <div>Loading media...</div>;
  }

  if (!media || media.length === 0) {
    return null;
  }

  const video = media.find((m) => m.type === "video");
  const images = media.filter((m) => m.type === "image");
  const slides = video ? [video, ...images] : images;

  return (
    <>
      <Swiper
        style={{ width: "100%", height: "100%" }}
        modules={[Navigation, Pagination]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        spaceBetween={16}
        slidesPerView={1}
        className="swiper-container rounded-4xl"
      >
        {slides.map((item, idx) => (
          <SwiperSlide key={idx}>
            {/* استفاده از روش fill={true} که بهترین روش برای next/image است */}
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Image
                  src={item.url}
                  alt={`media-${idx}`}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw, 33vw"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
