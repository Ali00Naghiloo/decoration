import { useTranslation } from "@/src/hooks/useTranslation";
import Image from "next/image";
import { useLocale } from "next-intl";

type TranslatedString = string | { fa?: string; en?: string };

interface SampleCardProps {
  id: string;
  title: TranslatedString;
  category?: string;
  cover?: string;
  description?: TranslatedString;
  des?: TranslatedString;
}

export default function SampleCard({
  id,
  title,
  category,
  cover,
  description,
  des,
}: SampleCardProps) {
  const { t } = useTranslation();
  const locale = useLocale() || "fa";

  const pickTranslated = (val?: TranslatedString) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return (val as any)[locale] || val.fa || val.en || "";
  };

  const displayTitle = pickTranslated(title);
  const displayDes = pickTranslated(des);
  const showDescription = !!pickTranslated(description);

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
