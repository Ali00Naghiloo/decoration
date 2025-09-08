import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { LogIn, MoveUp, Phone } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

export default function Footer() {
  const t = useTranslations("Footer");

  const socials = [
    { label: "Facebook", icon: "/icons/facebook.svg", link: "#" },
    { label: "Instagram", icon: "/icons/instagram.svg", link: "#" },
    { label: "LinkedIn", icon: "/icons/linkedin.svg", link: "#" },
    { label: "X", icon: "/icons/x.svg", link: "#" },
  ];

  const links = [
    { label: "home", selected: true },
    { label: "impact", selected: false },
    { label: "platform", selected: false },
    { label: "pricing", selected: false },
    { label: "manifesto", selected: false },
    { label: "blog", selected: false },
  ];

  return (
    <>
      <div className="lg:min-h-[750px] flex flex-col p-10 pb-[200px] relative bg-[#000000] text-white rounded-t-[10px]">
        <div className="flex justify-between py-5">
          {/* links */}
          <div className="flex flex-col gap-5 font-medium">
            {links.map((li) => (
              <span
                key={li.label}
                className={`${
                  li.selected ? "opacity-100" : "opacity-40"
                } cursor-pointer`}
              >
                {t(li.label)}
              </span>
            ))}

            <Button
              variant={"link"}
              className="!p-0 mt-auto text-[rgba(255,255,255,0.4)]"
            >
              {t("contact-us")}
            </Button>
          </div>

          <div className="flex flex-col gap-7 items-center max-w-[40%]">
            <Image src="/logo.png" alt={t("logoAlt")} width={52} height={52} />

            <p className="text-center text-[rgba(255,255,255,0.4)] font-medium">
              {t("footer-text")}
            </p>

            <Button
              variant="default"
              className="p-3 h-fit border-[1px] border-[rgba(255,255,255,0.2)] shadow-inner"
            >
              {t("contact")}{" "}
              <div className="bg-blue-600 rounded-[12px] p-2">
                <Phone />
              </div>
            </Button>

            <div className="flex gap-4 pt-10">
              {socials.map((social) => (
                <Button key={social.label} className="w-[41px] h-[41px] p-0">
                  <Image
                    className="!text-white"
                    src={social.icon}
                    alt={social.label}
                    width={24}
                    height={24}
                  />
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between items-end">
            <Button variant={"default"} className="!px-8 !py-6">
              <LogIn />
              {t("login")}
            </Button>

            <Button
              variant={"secondary"}
              className="rounded-[500px] w-fit py-4.5 !px-1.5"
            >
              <MoveUp />
            </Button>
          </div>
        </div>

        <Separator
          className="w-full h-[1px] bg-[rgba(255,255,255,0.2)]"
          orientation="vertical"
        />

        <div className="flex justify-between flex-wrap py-4">
          <span>{t("copyright")}</span>
          <span>{t("privacy-policy")}</span>
          <span>{t("terms-of-service")}</span>
        </div>

        {/* gradient background */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#006AF5] to-[#000000] opacity-50"></div>
      </div>
    </>
  );
}
