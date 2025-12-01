"use client";

import type { CSSProperties, VideoHTMLAttributes } from "react";
import React, { useEffect, useRef } from "react";

// پراپ‌های استاندارد تگ <video> را می‌پذیریم و دو پراپ سفارشی اضافه می‌کنیم:
// - enterFullscreen: در صورت true پس از mount وارد حالت تمام‌صفحه شود
// - startPlaying: در صورت true پس از mount و در صورت امکان ویدیو را پخش کند
type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  enterFullscreen?: boolean;
  startPlaying?: boolean;
};

export function Video(props: VideoProps) {
  const {
    className,
    poster,
    playsInline = true,
    controls = true,
    crossOrigin = "anonymous",
    enterFullscreen = false,
    startPlaying = false,
    ...rest
  } = props;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // اگر خواسته شده ویدیو را پخش کن
    if (startPlaying) {
      el.play().catch(() => {
        // ignore play rejection (autoplay policy)
      });
    }

    // اگر خواسته شده وارد فول‌اسکرین شود
    if (enterFullscreen) {
      // کوتاه تایم‌اووت تا مطمئن شویم ویدیو آماده است
      setTimeout(() => {
        try {
          el.requestFullscreen?.().catch?.(() => {});
        } catch {
          // ignore
        }
      }, 100);
    }
  }, [enterFullscreen, startPlaying]);

  return (
    <div
      className="aspect-video w-full rounded-3xl"
      style={{} as CSSProperties}
    >
      <video
        ref={videoRef}
        controls={controls}
        crossOrigin={crossOrigin}
        playsInline={playsInline}
        poster={poster}
        className={`${className ?? ""} w-full h-full`}
        {...rest}
      />
    </div>
  );
}
