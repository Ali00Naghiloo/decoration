import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Globe, LogIn, Phone } from "lucide-react";

export default function Header() {
  const t = useTranslations("Header");

  return (
    <>
      <div className="relative w-full flex justify-between p-6">
        <Image
          src="/logo.svg"
          alt={t("logoAlt")}
          width={52}
          height={52}
          className="!text-[#006FFF]"
        />

        <div className="flex justify-center gap-10 absolute top-0 left-1/2 transform -translate-x-[50%] h-full items-center">
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
          <Button variant={"ghost"} className="">
            <Globe />
            En
          </Button>
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
    </>
  );
}
