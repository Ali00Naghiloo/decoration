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

  // Translated fields
  const [titleFa, setTitleFa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionFa, setDescriptionFa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [desFa, setDesFa] = useState(""); // توضیح خلاصه فارسی
  const [desEn, setDesEn] = useState(""); // توضیح خلاصه انگلیسی

  const [lang, setLang] = useState<"fa" | "en">("fa"); // fallback/original
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const { getSampleById } = await import("@/src/lib/api");
        const data = await getSampleById(id);

        // data may include translations object or localized strings
        const translations = (data as any).translations || {};
        const titleObj =
          translations.title ||
          (typeof data.title === "object"
            ? data.title
            : { fa: data.title || "", en: "" });
        const descObj =
          translations.description ||
          (typeof data.description === "object"
            ? data.description
            : { fa: data.description || "", en: "" });
        const desObj =
          translations.des ||
          (typeof data.des === "object"
            ? data.des
            : { fa: data.des || "", en: "" });

        setTitleFa(titleObj.fa || "");
        setTitleEn(titleObj.en || "");
        // stored description likely wrapped HTML per language; remove wrapper? keep as-is for editor
        setDescriptionFa(descObj.fa || "");
        setDescriptionEn(descObj.en || "");
        setDesFa(desObj.fa || "");
        setDesEn(desObj.en || "");

        setLang((data as any).lang || "fa");

        if (Array.isArray(data.images)) {
          setImages(data.images);
        } else {
          setImages([]);
        }

        setVideoUrl(data.videoUrl || null);
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
      const { uploadFile } = await import("@/src/lib/upload");

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

      // Build translated payloads. Send as objects (API accepts object or JSON string)
      const payload: any = {
        title: { fa: titleFa.trim(), en: titleEn.trim() },
        description: { fa: descriptionFa, en: descriptionEn },
        des: { fa: desFa.trim(), en: desEn.trim() },
        lang,
        images: uploadedImages,
        videoUrl: videoUrlToSend,
      };

      await updateSample(id, payload);
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
        <div>
          <label className="block mb-1 font-semibold">
            نمایش و ویرایش زبان
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

        <div>
          <h2 className="text-lg font-semibold mb-2">
            ترجمه‌ها / Translations
          </h2>
          <label className="block mb-1 font-semibold">عنوان (فارسی)</label>
          <Input
            placeholder="عنوان نمونه"
            value={titleFa}
            onChange={(e) => setTitleFa(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Title (English)</label>
          <Input
            placeholder="Title"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            توضیح خلاصه (فارسی)
          </label>
          <Input value={desFa} onChange={(e) => setDesFa(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Summary (English)</label>
          <Input value={desEn} onChange={(e) => setDesEn(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-semibold">توضیحات (فارسی)</label>
          <React.Suspense fallback={<div>در حال بارگذاری ویرایشگر...</div>}>
            <RichTextEditor value={descriptionFa} onChange={setDescriptionFa} />
          </React.Suspense>
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Description (English)
          </label>
          <React.Suspense fallback={<div>در حال بارگذاری ویرایشگر...</div>}>
            <RichTextEditor value={descriptionEn} onChange={setDescriptionEn} />
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
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
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
                    const { uploadFile } = await import("@/src/lib/upload");
                    const uploadPromises = filesArr.map(async (file) => {
                      try {
                        const res = await uploadFile(file);
                        return res.url;
                      } catch (err) {
                        toast.error("آپلود تصویر انجام نشد");
                        return null;
                      }
                    });
                    const uploadedUrls = (
                      await Promise.all(uploadPromises)
                    ).filter(Boolean) as string[];
                    setImages((prev) => [...prev, ...uploadedUrls]);
                  } catch (err) {
                    toast.error("خطا در بارگذاری یا آپلود تصویر");
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
                    const { uploadFile } = await import("@/src/lib/upload");
                    const res = await uploadFile(file);
                    setVideoUrl(res.url);
                  } catch (err) {
                    toast.error("آپلود ویدیو انجام نشد");
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
