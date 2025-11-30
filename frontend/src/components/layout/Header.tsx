"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { LogIn, Menu, Phone } from "lucide-react";
import LanguageSwitcher from "../sections/LanguageSwitcher";
import { useTranslation } from "@/src/hooks/useTranslation";
import TextAnimate from "@/src/components/ui/TextAnimate";
import { CONTACT_PHONE, SOCIALS } from "@/src/config/socials";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerLinks: { href: string; key: string; disabled?: boolean }[] = [
    { href: "/learn", key: "learn", disabled: true },
    { href: "/about-me", key: "about-me", disabled: true },
    { href: "/", key: "portfolio", disabled: false },
    { href: "/samples", key: "blog", disabled: false },
  ];

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
        <Link href={"/"} className="cursor-pointer">
          <Image
            src="/logo.svg"
            alt={t("logoAlt")}
            width={52}
            height={52}
            className="!text-[#006FFF]"
          />
        </Link>

        <div className="hidden xl:flex justify-center gap-10 absolute top-0 left-1/2 transform -translate-x-[50%] h-full items-center">
          {headerLinks.map((link) => (
            <Link href={link.href} key={link.href} className="">
              <Button variant={"link"} className="text-lg">
                <TextAnimate as="span" by="word">
                  {t(link.key)}
                </TextAnimate>
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <LanguageSwitcher />

          <Button variant={"ghost"}>
            <LogIn />
            <TextAnimate as="span" by="word">
              {t("login")}
            </TextAnimate>
          </Button>
          <a href={`tel:${CONTACT_PHONE}`} className="inline-block">
            <Button variant="default" className="p-3 h-fit">
              <TextAnimate as="span" by="word">
                {t("contact")}
              </TextAnimate>{" "}
              <div className="bg-blue-600 rounded-[12px] p-2">
                <Phone />
              </div>
            </Button>
          </a>
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

        <div className="flex gap-3 items-center">
          <a href={`tel:${CONTACT_PHONE}`} className="inline-block">
            <Button
              variant={"default"}
              className="ml-auto flex items-center gap-2"
            >
              <Phone />
              {t("contact")}
            </Button>
          </a>

          <Button
            className="ml-auto bg-[#F9F9F9]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="باز کردن منو"
          >
            <Menu color="#000" />
          </Button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-50 flex"
              >
                {/* backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 bg-black"
                  onClick={() => setMenuOpen(false)}
                />

                {/* sliding panel */}
                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="ml-auto bg-white w-3/4 max-w-sm h-full p-6 pt-20 flex flex-col gap-6 shadow-lg relative"
                >
                  <button
                    className="absolute top-4 right-4 text-3xl text-gray-600 cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                    aria-label="بستن منو"
                  >
                    ×
                  </button>

                  <LanguageSwitcher />

                  {headerLinks.map((link) => (
                    <Link href={link.href} key={link.href} className="">
                      <Button
                        variant={"link"}
                        className="text-lg"
                        disabled={link.disabled}
                      >
                        <TextAnimate as="span" by="word">
                          {t(link.key)}
                        </TextAnimate>
                      </Button>
                    </Link>
                  ))}

                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="inline-block mt-auto"
                  >
                    <Button
                      variant="default"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Phone />
                      <TextAnimate as="span" by="word">
                        {t("contact")}
                      </TextAnimate>
                    </Button>
                  </a>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
