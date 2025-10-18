// src/components/MediaSlider.tsx

"use client";

// مرحله ۱: ایمپورت‌های مستقیم، دقیقا مانند نمونه کد کاری شما
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

// مرحله ۲: ایمپورت مستقیم CSS ها، که ثابت شد کار می‌کند
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface MediaItem {
  type: "image" | "video";
  url: string;
}

// ما دیگر از next/dynamic استفاده نمی‌کنیم
export default function MediaSlider({ media }: { media: MediaItem[] }) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (media && media.length > 0) {
      setLoading(false);
    }
  }, [media]);

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
    <Swiper
      // استایل مستقیم برای تضمین اندازه
      style={{ width: "100%", height: "100%" }}
      modules={[Navigation, Pagination]}
      navigation={true}
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1}
      className="swiper-container rounded-4xl" // یک کلاس برای اطمینان
    >
      {slides.map((item, idx) => (
        <SwiperSlide key={idx}>
          {/* استفاده از روش fill={true} که بهترین روش برای next/image است */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {item.type === "video" ? (
              <video
                src={item.url}
                controls
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
  );
}
