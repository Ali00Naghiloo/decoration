import MediaSlider, { MediaItem } from "@/src/components/forms/MediaSlider";

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

export default function SampleDetailPage({ item }: { item: PortfolioItem }) {
  // آماده‌سازی مدیا برای MediaSlider
  const media: MediaItem[] = [];
  if (item.videoUrl) media.push({ type: "video", url: item.videoUrl });
  if (item.images && item.images.length > 0)
    media.push(...item.images.map((url) => ({ type: "image" as const, url })));
  else if (item.cover) media.push({ type: "image", url: item.cover });

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "32px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px #0001",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
        {item.title}
      </h1>
      <div style={{ marginBottom: 24 }}>
        <MediaSlider media={media} />
      </div>
      {item.description && (
        <div
          style={{
            fontSize: 18,
            color: "#444",
            marginBottom: 24,
            background: "#f5f7fa",
            borderRadius: 8,
            padding: 16,
          }}
        >
          {item.description}
        </div>
      )}
      {item.content && (
        <div
          className="rich-text-content"
          style={{
            background: "#fafbfc",
            borderRadius: 10,
            padding: 24,
            fontSize: 17,
            color: "#222",
            marginTop: 24,
            boxShadow: "0 2px 8px #0001",
          }}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
    </div>
  );
}
