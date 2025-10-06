"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Globe } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname() ?? "";
  const params = useParams();
  const locale = useLocale();

  function onSelectChange(event: string) {
    const nextLocale = event as string;
    startTransition(() => {
      if (typeof pathname !== "string") return;
      const segments = pathname.split("/");
      if (segments[1] === "fa" || segments[1] === "en") {
        segments[1] = nextLocale;
      } else {
        segments.splice(1, 0, nextLocale);
      }
      const nextPath = segments.join("/") || "/";
      router.replace(nextPath);
    });
  }

  if (isPending) return <VscLoading className="animate-spin" />;

  return (
    <>
      {locale === "fa" ? (
        <Button
          onClick={() => onSelectChange("en")}
          variant={"ghost"}
          className=""
        >
          <Globe />
          En
        </Button>
      ) : (
        <Button
          onClick={() => onSelectChange("fa")}
          variant={"ghost"}
          className=""
        >
          <Globe />
          Fa
        </Button>
      )}
    </>
  );
}
