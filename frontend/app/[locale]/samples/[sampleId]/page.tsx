import SampleDetailPage from "@/src/components/pages/SampleDetailPage";
import { apiFetch } from "@/src/lib/api";
import { PortfolioItem } from "@/src/components/sections/SampleDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sampleId: string }>;
}) {
  const { sampleId } = await params;
  const { data } = await apiFetch(`/samples/${sampleId}`);
  const item = data as PortfolioItem | undefined;
  return {
    title: item?.title,
    description: item?.des || item?.title,
    openGraph: {
      title: item?.title,
      description: item?.description || item?.title,
      images: item?.cover ? [item.cover] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: item?.title,
      description: item?.description || item?.title,
      images: item?.cover ? [item.cover] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ sampleId: string }>;
}) {
  const { sampleId } = await params;
  return <SampleDetailPage sampleId={sampleId} />;
}
