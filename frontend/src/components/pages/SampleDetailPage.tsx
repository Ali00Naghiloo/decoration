"use client";

import React from "react";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import SampleDetail, {
  PortfolioItem,
} from "@/src/components/sections/SampleDetail";
import { apiFetch } from "@/src/lib/api";
import { useTranslation } from "@/src/hooks/useTranslation";

interface Props {
  sampleId: string;
}

export default function SampleDetailPage({ sampleId }: Props) {
  const [item, setItem] = React.useState<PortfolioItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await apiFetch(`/samples/${sampleId}`);
      setItem(data as PortfolioItem);
      setLoading(false);
    }
    fetchData();
  }, [sampleId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        {t("loading-sample")}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[1440px] mx-auto">
        <SampleDetail item={item!} />
      </div>
      <Footer />
    </>
  );
}
