import { useTranslations } from "next-intl";
import React from "react";
import LanguageSwitcher from "../sections/LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Header");

  return (
    <>
      <LanguageSwitcher />
      <div>Header {t("login")}</div>
    </>
  );
}
