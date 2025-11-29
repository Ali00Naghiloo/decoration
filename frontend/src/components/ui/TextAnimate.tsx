import React, { ElementType, memo } from "react";
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
  once?: boolean;
  accessible?: boolean;
}

/**
 * Lightweight text animator using framer-motion.
 * Splits text by `by` and animates segments with a simple fade/slide.
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
}: TextAnimateProps) => {
  const MotionComponent = motion(Component);

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
        custom={delay}
        variants={containerVariants}
        initial="hidden"
        animate="show"
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