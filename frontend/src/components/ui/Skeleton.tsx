import React from "react";

type Variant = "paragraph" | "card" | "image" | "avatar";

interface SkeletonProps {
  variant?: Variant;
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

const toSize = (v?: string | number) => {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
};

export default function Skeleton({
  variant = "paragraph",
  width = "100%",
  height,
  className = "",
  lines = 3,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: toSize(width),
    height: height ? toSize(height) : undefined,
  };

  const base = "bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse";

  if (variant === "image") {
    return <div className={`${base} ${className}`} style={{ ...style, minHeight: style.height ?? 120 }} />;
  }

  if (variant === "avatar") {
    return (
      <div
        className={`${base} ${className}`}
        style={{ ...style, width: style.width ?? 48, height: style.height ?? 48, borderRadius: "50%" }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div className={className}>
        <div className={`${base} w-full rounded-2xl`} style={{ minHeight: 160 }} />
        <div className="mt-4 space-y-2">
          <div className={`${base} h-6 w-3/4`} />
          <div className={`${base} h-4 w-1/3`} />
          <div className="space-y-2 mt-2">
            <div className={`${base} h-3 w-full`} />
            <div className={`${base} h-3 w-5/6`} />
          </div>
          <div className="mt-4">
            <div className={`${base} inline-block px-3 py-2 rounded-md`} />
          </div>
        </div>
      </div>
    );
  }

  // paragraph
  return (
    <div className={className} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`${base} h-4 ${i === 0 ? "w-5/6" : "w-full"} mb-2`} />
      ))}
    </div>
  );
}