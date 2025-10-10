import localFont from "next/font/local";

export const yekanFont = localFont({
  src: [
    {
      path: "../public/fonts/YekanBakhFaNum-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-SemiBold.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-yekan",
  display: "swap",
});
