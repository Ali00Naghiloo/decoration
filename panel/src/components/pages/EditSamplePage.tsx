// EditSamplePage component extracted from /app/dashboard/samples/[id]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { updateSample } from "@/src/lib/api";
const RichTextEditor = dynamic(
  () => import("@/src/components/forms/RichTextEditor"),
  { ssr: false }
);

export default function EditSamplePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [des, setDes] = useState(""); // توضیح خلاصه
  const [lang, setLang] = useState<"fa" | "en">("fa"); // زبان نمونه‌کار
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
        setDes(data.des || "");
        setLang((data as any).lang || "fa");

        if (Array.isArray(data.images)) {
          setImages(data.images);
        } else {
          setImages([]);
        }

        setVideoUrl(null);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "خطا در دریافت اطلاعات نمونه‌کار");
      }
    };
    if (id) fetchSample();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dynamically import uploadFile utility
      const { uploadFile } = await import("@/src/lib/upload");

      // Upload new images if any (File), keep URLs as is
      const uploadedImages: string[] = [];
      for (const img of images) {
        if (typeof img === "string") {
          uploadedImages.push(img);
        } else if (
          img &&
          typeof img === "object" &&
          "name" in img &&
          "type" in img
        ) {
          const res = await uploadFile(img as File);
          uploadedImages.push(res.url);
        }
      }

      // Upload new video if needed
      let videoUrlToSend: string | undefined = undefined;
      if (
        videoUrl &&
        typeof videoUrl === "object" &&
        "name" in videoUrl &&
        "type" in videoUrl
      ) {
        const res = await uploadFile(videoUrl as File);
        videoUrlToSend = res.url;
      } else if (typeof videoUrl === "string") {
        videoUrlToSend = videoUrl;
      }

      const data: {
        title: string;
        description: string;
        des: string;
        lang?: "fa" | "en";
        images?: string[];
        videoUrl?: string;
      } = {
        title,
        description,
        des,
        lang,
        images: uploadedImages,
        videoUrl: videoUrlToSend,
      };

      await updateSample(id, data);
      toast.success("نمونه‌کار با موفقیت ویرایش شد!");
      router.push("/dashboard/samples");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "خطا در ویرایش نمونه‌کار");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">ویرایش نمونه</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="عنوان نمونه"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div>
          <label className="block mb-1 font-semibold">
            زبان نمونه‌کار (lang)
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "fa" | "en")}
            className="w-full border rounded px-3 py-2 mb-3"
          >
            <option value="fa">فارسی (fa)</option>
            <option value="en">English (en)</option>
          </select>
        </div>
        <Input
          placeholder="توضیح خلاصه (des)"
          value={des}
          onChange={(e) => setDes(e.target.value)}
        />
        {/* توضیحات با RichTextEditor */}
        <div>
          <label className="block mb-1 font-semibold">توضیحات</label>
          <React.Suspense fallback={<div>در حال بارگذاری ویرایشگر...</div>}>
            <RichTextEditor value={description} onChange={setDescription} />
          </React.Suspense>
        </div>

        <div className="mt-6">
          <label className="block mb-1 font-semibold">
            فایل‌های آپلود شده:
          </label>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`نمونه کار ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    onClick={() => {
                      const updated = images.filter((_, i) => i !== idx);
                      setImages(updated);
                    }}
                  >
                    حذف
                  </button>
                  <input
                    id={`replace-image-${idx}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        try {
                          const { uploadFile } = await import(
                            "@/src/lib/upload"
                          );
                          const res = await uploadFile(e.target.files[0]);
                          setImages((prev) =>
                            prev.map((item, i) => (i === idx ? res.url : item))
                          );
                        } catch (err) {
                          toast.error("جایگزینی تصویر انجام نشد");
                        }
                      }
                    }}
                  />
                  <label htmlFor={`replace-image-${idx}`}>
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      جایگزینی
                    </button>
                  </label>
                </div>
              ))}
            </div>
          )}
          {videoUrl && (
            <div className="relative group mb-2">
              <video
                src={videoUrl}
                controls
                className="w-full max-h-64 rounded"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                onClick={() => setVideoUrl(null)}
              >
                حذف
              </button>
              <input
                id="replace-video"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    try {
                      const { uploadFile } = await import("@/src/lib/upload");
                      const res = await uploadFile(e.target.files[0]);
                      setVideoUrl(res.url);
                    } catch (err) {
                      toast.error("جایگزینی ویدیو انجام نشد");
                    }
                  }
                }}
              />
              <label htmlFor="replace-video">
                <button
                  type="button"
                  className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  جایگزینی
                </button>
              </label>
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <input
              id="edit-upload-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                if (e.target.files) {
                  const filesArr = Array.from(e.target.files);
                  try {
                    // Debug log
                    console.log("Uploading images:", filesArr);
                    const { uploadFile } = await import("@/src/lib/upload");
                    const uploadPromises = filesArr.map(async (file) => {
                      try {
                        const res = await uploadFile(file);
                        return res.url;
                      } catch (err) {
                        toast.error("آپلود تصویر انجام نشد");
                        console.error("Image upload error:", err);
                        return null;
                      }
                    });
                    const uploadedUrls = (
                      await Promise.all(uploadPromises)
                    ).filter(Boolean) as string[];
                    setImages((prev) => [...prev, ...uploadedUrls]);
                  } catch (err) {
                    toast.error("خطا در بارگذاری یا آپلود تصویر");
                    console.error("Upload handler error:", err);
                  }
                }
              }}
            />
            <label htmlFor="edit-upload-images" style={{ cursor: "pointer" }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("edit-upload-images")?.click()
                }
              >
                افزودن تصویر
              </Button>
            </label>
            <input
              id="edit-upload-video"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  try {
                    // Debug log
                    console.log("Uploading video:", file);
                    const { uploadFile } = await import("@/src/lib/upload");
                    const res = await uploadFile(file);
                    setVideoUrl(res.url);
                  } catch (err) {
                    toast.error("آپلود ویدیو انجام نشد");
                    console.error("Video upload error:", err);
                  }
                }
              }}
            />
            <label htmlFor="edit-upload-video" style={{ cursor: "pointer" }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("edit-upload-video")?.click()
                }
              >
                افزودن ویدیو
              </Button>
            </label>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white hover:bg-primary/90"
        >
          {loading ? "در حال ویرایش..." : "ویرایش"}
        </Button>
      </form>
    </div>
  );
}
