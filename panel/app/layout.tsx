import type { Metadata } from "next";
import { yekanFont } from "./fonts";
import "./globals.css";
import QueryProvider from "@/src/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  description: "پنل مدیریت پروژه",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${yekanFont.className} antialiased`}>
        <QueryProvider>
          {children}
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
