import { useTranslation } from "@/src/hooks/useTranslation";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";

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
  href?: string;
}

export default function SampleCard({
  title,
  category,
  cover,
  description,
  des,
  href,
}: SampleCardProps) {
  const { t } = useTranslation();
  const rawLocale = useLocale() || "fa";
  const locale = (rawLocale.toString().startsWith("fa") ? "fa" : "en") as
    | "fa"
    | "en";

  const pickTranslated = (val?: TranslatedString) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    const obj = val as { [k: string]: string | undefined };
    const byLocale = obj[locale];
    if (typeof byLocale === "string" && byLocale.trim()) return byLocale;
    if (typeof obj.fa === "string" && obj.fa.trim()) return obj.fa;
    if (typeof obj.en === "string" && obj.en.trim()) return obj.en;
    return "";
  };

  // Use per-field translated objects directly (backend returns title/description/des as {fa,en})
  const displayTitle = pickTranslated(title);
  const displayDes = pickTranslated(des);

  const showDescription = !!(
    description &&
    (typeof description === "string"
      ? description
      : pickTranslated(description))
  );

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
              ? `${displayDes.slice(0, 200)}...`
              : displayDes}
          </div>
        )}
        {href ? (
          <Link
            href={href}
            className="mt-auto inline-flex items-center gap-2 px-3 py-2 rounded-md text-[#006FFF] border border-[#006FFF] hover:bg-[#006FFF] hover:text-white transition-colors duration-150"
          >
            {t("read-more")}
            <svg
              className={`w-4 h-4 transform transition-transform ${
                locale === "fa" ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        ) : (
          <span className="mt-auto inline-flex items-center gap-2 px-3 py-2 rounded-md text-[#006FFF] opacity-80">
            {t("read-more")}
            <svg
              className={`w-4 h-4 transform transition-transform ${
                locale === "fa" ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
