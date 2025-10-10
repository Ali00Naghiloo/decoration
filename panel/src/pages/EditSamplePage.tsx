// EditSamplePage component extracted from /app/dashboard/samples/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import toast from "react-hot-toast";

export default function EditSamplePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const { getSampleById } = await import("@/src/lib/api");
        const data = await getSampleById(id);
        setTitle(data.title);
        setDescription(data.description);
        setImages(data.images || []);
        setVideoUrl(data.video || null);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "خطا در دریافت اطلاعات نمونه");
      }
    };
    if (id) fetchSample();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { updateSample } = await import("@/src/lib/api");
      await updateSample(id, { title, description });
      toast.success("نمونه با موفقیت ویرایش شد!");
      router.push("/dashboard/samples");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "خطا در ویرایش نمونه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">ویرایش نمونه</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="عنوان نمونه"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="توضیحات نمونه"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {loading ? "در حال ویرایش..." : "ویرایش"}
        </Button>
      </form>
      {(images.length > 0 || videoUrl) && (
        <div className="mt-6">
          <label className="block mb-1 font-semibold">
            فایل‌های آپلود شده:
          </label>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`نمونه کار ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
          )}
          {videoUrl && (
            <video
              src={videoUrl}
              controls
              className="w-full max-h-64 rounded"
            />
          )}
        </div>
      )}
    </div>
  );
}
