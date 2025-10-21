"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Globe, LogIn, Menu, Phone } from "lucide-react";
import LanguageSwitcher from "../sections/LanguageSwitcher";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open (mobile)
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  const { t } = useTranslation();

  return (
    <>
      <div className="hidden w-full xl:flex justify-between p-6 h-[10vh] bg-white z-10 sticky top-0">
        <Image
          src="/logo.svg"
          alt={t("logoAlt")}
          width={52}
          height={52}
          className="!text-[#006FFF]"
        />

        <div className="hidden xl:flex justify-center gap-10 absolute top-0 left-1/2 transform -translate-x-[50%] h-full items-center">
          <Button variant={"link"} className="">
            {t("learn")}
          </Button>
          <Button variant={"link"} className="">
            {t("about-me")}
          </Button>
          <Button variant={"link"} className="">
            {t("portfolio")}
          </Button>
          <Button variant={"link"} className="">
            {t("blog")}
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <LanguageSwitcher />

          <Button variant={"ghost"}>
            <LogIn />
            {t("login")}
          </Button>
          <Button variant="default" className="p-3 h-fit">
            {t("contact")}{" "}
            <div className="bg-blue-600 rounded-[12px] p-2">
              <Phone />
            </div>
          </Button>
        </div>
      </div>

      <div className="xl:hidden flex items-center justify-between p-4">
        <Image
          src="/logo.svg"
          alt={t("logoAlt")}
          width={52}
          height={52}
          className="!text-[#006FFF]"
        />

        <div className="flex gap-3">
          <Button className="ml-auto bg-[#F9F9F9]">
            <LogIn color="#000" />
          </Button>
          <Button
            className="ml-auto bg-[#F9F9F9]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu color="#000" />
          </Button>
          {menuOpen && (
            <div
              className={`fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-40 flex justify-end z-50 transition-all duration-300 ease-in-out ${
                menuOpen ? "visible" : "invisible"
              }`}
            >
              <div className="bg-white w-3/4 max-w-sm h-full p-6 pt-20 flex flex-col gap-6 shadow-lg relative animate-slide-in">
                <button
                  className="absolute top-4 right-4 text-3xl text-gray-600 cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                  aria-label="بستن منو"
                >
                  ×
                </button>
                <LanguageSwitcher />
                <Button variant={"link"} className="text-lg">
                  {t("learn")}
                </Button>
                <Button variant={"link"} className="text-lg">
                  {t("about-me")}
                </Button>
                <Button variant={"link"} className="text-lg">
                  {t("portfolio")}
                </Button>
                <Button variant={"link"} className="text-lg">
                  {t("blog")}
                </Button>
                <Button
                  variant="default"
                  className="mt-4 flex items-center justify-center gap-2"
                >
                  <Phone />
                  {t("contact")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
