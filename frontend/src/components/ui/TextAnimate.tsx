import React, { ElementType, memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "@/src/lib/utils";

type AnimationType = "text" | "word" | "character" | "line";

interface TextAnimateProps {
  children: string;
  className?: string;
  segmentClassName?: string;
  delay?: number;
  duration?: number;
  as?: ElementType;
  by?: AnimationType;
  once?: boolean; // if animateOnView is true, whether to only animate once
  accessible?: boolean;
  animateOnView?: boolean; // when true, animation runs when element enters viewport
}

/**
 * Lightweight text animator using framer-motion.
 * Splits text by `by` and animates segments with a simple fade/slide.
 * When `animateOnView` is true the animation will start when the element
 * becomes visible (IntersectionObserver). Default: animateOnView = true.
 */
const staggerTimings: Record<AnimationType, number> = {
  text: 0.06,
  word: 0.04,
  character: 0.02,
  line: 0.06,
};

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: (custom: number = 0) => ({
    opacity: 1,
    transition: {
      delayChildren: custom,
      staggerChildren: 0.03,
    },
  }),
  exit: { opacity: 0 },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32 } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  className,
  segmentClassName,
  as: Component = "p",
  by = "word",
  once = true,
  accessible = true,
  animateOnView = true,
}: TextAnimateProps) => {
  const MotionComponent: any = motion(Component);
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(!animateOnView);

  useEffect(() => {
    if (!animateOnView) return;

    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once && observer) {
              observer.unobserve(entry.target);
            }
          } else {
            if (!once) {
              setVisible(false);
            }
          }
        });
      },
      {
        root: null,
        // Require the element to be substantially in view before starting the animation.
        // A conservative rootMargin and higher threshold avoids early triggering.
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.5,
      }
    );

    observer.observe(el as Element);

    return () => {
      if (observer && el) observer.unobserve(el as Element);
      observer = null;
    };
  }, [animateOnView, once]);

  let segments: string[] = [];
  switch (by) {
    case "word":
      segments = children.split(/(\s+)/);
      break;
    case "character":
      segments = children.split("");
      break;
    case "line":
      segments = children.split("\n");
      break;
    case "text":
    default:
      segments = [children];
      break;
  }

  return (
    <AnimatePresence>
      <MotionComponent
        ref={ref}
        custom={delay}
        variants={containerVariants}
        initial="hidden"
        animate={animateOnView ? (visible ? "show" : "hidden") : "show"}
        exit="exit"
        className={cn("whitespace-pre-wrap", className)}
      >
        {accessible && <span className="sr-only">{children}</span>}
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${segment}-${i}`}
            variants={itemVariants}
            style={by === "character" ? { display: "inline-block" } : undefined}
            className={cn(
              by === "line" ? "block" : "inline-block whitespace-pre",
              segmentClassName
            )}
            aria-hidden={accessible ? true : undefined}
          >
            {segment}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  );
};

export const TextAnimate = memo(TextAnimateBase);
export default TextAnimate;
