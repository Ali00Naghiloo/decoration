// src/components/MediaSlider.tsx

"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { NavigationOptions } from "swiper/types";
import Image from "next/image";
import React, { useState } from "react";
import { Video } from "../ui/video";

export interface MediaItem {
  type: "image" | "video";
  url: string;
}

export default function MediaSlider({ media }: { media: MediaItem[] }) {
  const [loading, setLoading] = useState(true);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Swiper refs for main and fullscreen instances
  const swiperRef = React.useRef<SwiperType | null>(null);
  const fullscreenSwiperRef = React.useRef<SwiperType | null>(null);

  React.useEffect(() => {
    if (media && media.length > 0) {
      setLoading(false);
    }
  }, [media]);

  // No custom navigation wiring — use Swiper's default navigation.
  // We track current index via onSlideChange and attach instance via onSwiper.

  if (!media || media.length === 0) {
    return null;
  }

  const video = media.find((m) => m.type === "video");
  const images = media.filter((m) => m.type === "image");
  const cover = media.find((m) => m.type === "image");
  const slides = video ? [video, ...images] : images;

  return (
    <>
      <Swiper
        style={{ width: "100%", height: "100%" }}
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: true }}
        spaceBetween={16}
        slidesPerView={1}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setCurrentIndex(s.activeIndex)}
        className="swiper-container rounded-4xl"
      >
        {slides.map((item, idx) => (
          <SwiperSlide key={idx}>
            {/* استفاده از روش fill={true} که بهترین روش برای next/image است */}
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              {item.type === "image" ? (
                <>
                  <Image
                    src={item.url}
                    alt={`media-${idx}`}
                    fill={true}
                    style={{ objectFit: "cover", cursor: "pointer" }}
                    sizes="(max-width: 768px) 100vw, 50vw, 33vw"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setFullscreenOpen(true);
                    }}
                  />
                </>
              ) : (
                <div className="relative w-full h-full">
                  <Video
                    className="!h-full w-full object-cover"
                    src={item.url}
                    poster={cover?.url}
                    autoPlay
                    muted
                    loop
                    controls={false}
                  />
                  <button
                    aria-label="open fullscreen"
                    className="absolute inset-0 z-10 bg-transparent"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setFullscreenOpen(true);
                    }}
                  />
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setFullscreenOpen(false)}
        >
          <div
            className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 cursor-pointer bg-white rounded-full px-2 py-1 shadow text-gray-700 hover:bg-gray-200 z-40"
              onClick={() => setFullscreenOpen(false)}
              aria-label="بستن"
            >
              &#10005;
            </button>

            <Swiper
              initialSlide={currentIndex}
              onSwiper={(s) => (fullscreenSwiperRef.current = s)}
              modules={[Navigation, Pagination]}
              navigation={true}
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              className="w-full h-full"
              style={{ width: "100%", height: "90vh" }}
            >
              {slides.map((item, idx) => (
                <SwiperSlide key={`fs-${idx}`}>
                  <div className="w-full h-full relative">
                    {item.type === "image" ? (
                      // use <img> to avoid Next/Image loader issues in fullscreen modal
                      <img
                        src={item.url}
                        alt={`media-full-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video
                        src={item.url}
                        poster={cover?.url}
                        controls
                        autoPlay={false}
                        muted={false}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}
