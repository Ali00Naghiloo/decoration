import { useTranslation } from "@/src/hooks/useTranslation";
import { SampleTypes } from "@/src/types/sample.types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SampleCard({ title, category, id }: SampleTypes) {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-[290px] xl:w-[420px] h-[385px] xl:h-[490px] flex flex-col gap-6 rounded-3xl p-4 bg-[#F9F9F9] shadow">
        <div className="w-full h-1/2 bg-gradient-to-b from-[#000] to-[#006AF5] rounded-4xl"></div>

        <div className="h-1/2 xl:px-4 flex flex-col gap-2">
          <div className="text-2xl font-bold text-[1.3em]">{title}</div>
          <div className="text-lg text-[#006FFF] mt-2">{category}</div>

          <Link
            href={"/"}
            className="flex items-center underline mt-auto gap-2 p-2"
          >
            {t("read-more")} <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  );
}
