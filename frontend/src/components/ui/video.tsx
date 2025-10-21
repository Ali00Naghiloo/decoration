"use client";

/* eslint-disable jsx-a11y/media-has-caption */

import type Plyr from "plyr";
import type { CSSProperties, VideoHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";

// پراپ‌های استاندارد تگ <video> را می‌پذیریم
type VideoProps = VideoHTMLAttributes<HTMLVideoElement>;

export function Video(props: VideoProps) {
  // پراپ‌های پیش‌فرض را جدا می‌کنیم
  const {
    className,
    poster,
    playsInline = true,
    controls = true,
    crossOrigin = "anonymous",
    ...rest
  } = props;

  // از useRef برای نگهداری خود تگ <video> و نمونه Plyr استفاده می‌کنیم
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerInstance = useRef<Plyr | null>(null);

  useEffect(() => {
    // فقط در سمت کلاینت اجرا شود و تنها یک بار
    if (videoRef.current && !playerInstance.current) {
      // ایمپورت داینامیک Plyr برای جلوگیری از خطای SSR
      import("plyr").then(({ default: Plyr }) => {
        playerInstance.current = new Plyr(videoRef.current!, {
          // کنترل‌های مورد نظر خود را اینجا تعریف کنید
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "fullscreen",
          ],
          // می‌توانید تنظیمات دیگر را هم اینجا اضافه کنید
          // مثلاً برای فعال کردن thumbnail ها
          // previewThumbnails: { enabled: true, src: 'path/to/thumbnails.vtt' }
        });
      });
    }

    // در زمان unmount شدن کامپوننت، پلیر را از بین می‌بریم تا حافظه آزاد شود
    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
        playerInstance.current = null;
      }
    };
  }, []); // آرایه وابستگی خالی یعنی این useEffect فقط یک بار اجرا می‌شود

  return (
    // این div والد استایل‌های کلی و نسبت ابعاد را مدیریت می‌کند
    <div
      className="aspect-video w-full rounded-4xl overflow-hidden"
      // برای تغییر رنگ اصلی پلیر (مثلاً نارنجی، آبی و ...)
      style={{ "--plyr-color-main": "#006FFF" } as CSSProperties}
    >
      <video
        ref={videoRef}
        controls={controls}
        crossOrigin={crossOrigin}
        playsInline={playsInline}
        poster={poster}
        className="w-full h-full"
        {...rest}
      />
    </div>
  );
}
