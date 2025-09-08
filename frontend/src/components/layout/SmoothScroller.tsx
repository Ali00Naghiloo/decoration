"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroller({ children }: { children: ReactNode }) {
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.8,
      easing: easeInOutCubic,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
