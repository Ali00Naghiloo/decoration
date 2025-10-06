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
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  function onSelectChange(event: string) {
    const nextLocale = event as string;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
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
