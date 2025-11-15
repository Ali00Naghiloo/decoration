import { useTranslation } from "@/src/hooks/useTranslation";
import Image from "next/image";
import { useLocale } from "next-intl";

/**
 * TranslatedString may be a plain string (legacy) or an object with
 * language keys. The index signature lets us access keys safely
 * without casting to `any`.
 */
type TranslatedString =
  | string
  | { fa?: string; en?: string; [key: string]: string | undefined };

interface SampleCardProps {
  id: string;
  title: TranslatedString;
  category?: string;
  cover?: string;
  description?: TranslatedString;
  des?: TranslatedString;
  // optionally accept a translations object (panel/backend may provide this)
  translations?: {
    title?: TranslatedString;
    description?: TranslatedString;
    des?: TranslatedString;
    [key: string]: TranslatedString | undefined;
  };
}

export default function SampleCard({
  title,
  category,
  cover,
  description,
  des,
  translations,
}: SampleCardProps) {
  const { t } = useTranslation();
  const rawLocale = useLocale() || "fa";
  const locale = (rawLocale.toString().startsWith("fa") ? "fa" : "en") as
    | "fa"
    | "en";

  const pickTranslated = (val?: TranslatedString) => {
    if (!val) return "";
    if (typeof val === "string") return val;

    // Use a typed local object to avoid `any` casts
    const obj = val as { [k: string]: string | undefined };

    // Prefer the current locale only if it's a non-empty string.
    const byLocale = obj[locale];
    if (typeof byLocale === "string" && byLocale.trim().length > 0)
      return byLocale;

    // fallback to any non-empty translation available
    if (typeof obj.fa === "string" && obj.fa.trim().length > 0) return obj.fa;
    if (typeof obj.en === "string" && obj.en.trim().length > 0) return obj.en;

    // last resort: return locale key even if empty, or empty string
    return byLocale || "";
  };

  // Prefer translation for the current locale when available.
  // If translations.<field> has no value for the current locale, fall back to
  // the already-localized top-level prop (the backend returns `title` as a
  // localized string when requested with ?locale=...).
  const getLocaleRaw = (val?: TranslatedString) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return (val as { [k: string]: string })[locale] ?? "";
  };

  const displayTitle =
    // backend now returns `title` as an object; handle both shapes
    typeof translations?.title !== "undefined"
      ? pickTranslated(translations?.title)
      : typeof title === "object"
      ? pickTranslated(title)
      : (title as string);

  const displayDes =
    typeof translations?.des !== "undefined"
      ? pickTranslated(translations?.des)
      : typeof des === "object"
      ? pickTranslated(des)
      : (des as string);

  const showDescription = !!(typeof translations?.description !== "undefined"
    ? !!pickTranslated(translations?.description)
    : typeof description === "object"
    ? !!pickTranslated(description)
    : !!(description as string));

  return (
    <div className="w-[290px] xl:w-[420px] h-[385px] xl:h-[490px] flex flex-col items-start gap-6 rounded-3xl p-4 bg-[#F9F9F9] shadow">
      {cover ? (
        <Image
          src={cover}
          alt={displayTitle || "sample"}
          className="w-full h-1/2 object-cover rounded-2xl"
          style={{ minHeight: 160, background: "#eee" }}
          width={200}
          height={200}
        />
      ) : (
        <div className="w-full h-1/2 bg-gradient-to-b from-[#000] to-[#006AF5] rounded-2xl" />
      )}

      <div className="h-1/2 xl:px-4 flex flex-col gap-2">
        <div className="text-2xl font-bold text-[1.3em]">{displayTitle}</div>
        <div className="text-lg text-[#006FFF] mt-2">{category}</div>
        {showDescription && (
          <div className="text-gray-500 text-[1em] mt-2 line-clamp-2">
            {displayDes && displayDes.length > 50
              ? `${displayDes.slice(0, 70)}...`
              : displayDes}
          </div>
        )}
        <span className="flex items-center underline mt-auto gap-2 p-2 text-blue-600 cursor-pointer">
          {t("read-more")}
        </span>
      </div>
    </div>
  );
}
