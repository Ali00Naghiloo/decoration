import localFont from "next/font/local";

export const satoshiFont = localFont({
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Black.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi", // یک متغیر CSS برای استفاده در سراسر پروژه
  display: "swap", // برای بارگذاری بهتر
});

export const yekanFont = localFont({
  src: [
    {
      path: "../public/fonts/yekan/YekanBakhFaNum-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/yekan/YekanBakhFaNum-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/yekan/YekanBakhFaNum-SemiBold.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/yekan/YekanBakhFaNum-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/yekan/YekanBakhFaNum-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-yekan", // یک متغیر CSS برای استفاده در سراسر پروژه
  display: "swap", // برای بارگذاری بهتر
});
