"use client";
import dynamic from "next/dynamic";
import "swiper/css";

export interface MediaItem {
  type: "image" | "video";
  url: string;
}

// Swiper را فقط سمت کلاینت ایمپورت کن
const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
});
const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export default function MediaSlider({ media }: { media: MediaItem[] }) {
  if (!media || media.length === 0) return null;

  // ویدیو اول، سپس عکس‌ها
  const video = media.find((m) => m.type === "video");
  const images = media.filter((m) => m.type === "image");

  const slides: MediaItem[] = [];
  if (video) slides.push(video);
  slides.push(...images);

  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1}
      className="mb-6 rounded-lg overflow-hidden w-full h-full"
    >
      {slides.map((item, idx) => (
        <SwiperSlide key={idx}>
          {item.type === "video" ? (
            <video
              src={item.url}
              controls
              className="w-full max-w-[400px] max-h-[400px] mx-auto rounded"
            />
          ) : (
            <img
              src={item.url}
              alt={`media-${idx}`}
              className="w-full max-w-[400px] max-h-[400px] mx-auto object-contain rounded"
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
