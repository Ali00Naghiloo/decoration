"use client";

import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import SampleDetail, {
  PortfolioItem,
} from "@/src/components/sections/SampleDetail";
import { apiFetch } from "@/src/lib/api";

interface Props {
  sampleId: string;
}

import React from "react";

export default function SampleDetailPage({ sampleId }: Props) {
  const [item, setItem] = React.useState<PortfolioItem | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await apiFetch(`/samples/${sampleId}`);
      setItem(data as PortfolioItem);
      setLoading(false);
    }
    fetchData();
  }, [sampleId]);

  if (loading) {
    return <div>Loading portfolio...</div>;
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
