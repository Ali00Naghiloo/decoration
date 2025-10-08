"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Globe, LogIn, Menu, Phone } from "lucide-react";
import LanguageSwitcher from "../sections/LanguageSwitcher";
import { useTranslation } from "@/src/hooks/useTranslation";

export default function Header() {
  const { t } = useTranslation();

  return (
    <>
      <div className="hidden w-full xl:flex justify-between p-6 h-[10vh] bg-white sticky top-0">
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
          <Button className="ml-auto bg-[#F9F9F9]">
            <Menu color="#000" />
          </Button>
        </div>
      </div>
    </>
  );
}
