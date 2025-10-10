import React, { useEffect, useState } from "react";
import MediaSlider, { MediaItem } from "@/src/components/forms/MediaSlider";

interface SampleData {
  title: string;
  description: string;
  media: MediaItem[];
}

export default function Sample({ sampleId }: { sampleId: string }) {
  const [sample, setSample] = useState<SampleData | null>(null);

  useEffect(() => {
    // فرض: API شما اطلاعات نمونه را با media (آرایه‌ای از عکس و ویدیو) برمی‌گرداند
    async function fetchSample() {
      try {
        const res = await fetch(`/api/samples/${sampleId}`);
        const data = await res.json();
        setSample({
          title: data.data.item.title,
          description: data.data.item.description,
          media: [
            ...(data.data.item.videos || []).map((url: string) => ({
              type: "video",
              url,
            })),
            ...(data.data.item.images || []).map((url: string) => ({
              type: "image",
              url,
            })),
          ],
        });
      } catch {
        setSample(null);
      }
    }
    fetchSample();
  }, [sampleId]);

  if (!sample) return <div>در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{sample.title}</h1>
      <MediaSlider media={sample.media} />
      <div
        className="prose prose-lg max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: sample.description }}
      />
    </div>
  );
}
