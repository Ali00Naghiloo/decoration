import React from "react";
import SampleDetailPage from "@/src/components/pages/SampleDetailPage";

interface PortfolioItem {
  _id: string;
  title: string;
  cover?: string;
  description?: string;
  content?: string;
  images?: string[];
  mediaUrl?: string;
  mediaType?: string;
  videoUrl?: string;
  category?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getPortfolioItem(id: string): Promise<PortfolioItem | null> {
  const res = await fetch(`${API_BASE}/api/samples/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data || null;
}

export default async function Page({
  params,
}: {
  params: { sampleId: string };
}) {
  const item = await getPortfolioItem(params.sampleId);

  if (!item) {
    return <div style={{ padding: 32 }}>نمونه‌کار پیدا نشد.</div>;
  }

  return <SampleDetailPage item={item} />;
}
