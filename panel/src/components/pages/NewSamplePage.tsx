"use client";

import React, { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import api from "@/src/lib/api";

const RichTextEditor = dynamic(
  () => import("@/src/components/forms/RichTextEditor"),
  {
    ssr: false, // editor is client-only
    loading: () => <p>در حال بارگذاری ادیتور...</p>,
  }
);

export default function NewSamplePage() {
  // Translated fields: fa and en
  const [titleFa, setTitleFa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [desFa, setDesFa] = useState("");
  const [desEn, setDesEn] = useState("");
  const [descriptionFa, setDescriptionFa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const [lang, setLang] = useState<"fa" | "en">("fa"); // default editor language view
  const [status, setStatus] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation: require at least one title and one description (in any language)
    if (!titleFa.trim() && !titleEn.trim()) {
      toast.error("حداقل یکی از عنوان‌ها را وارد کنید (fa یا en).");
      return;
    }
    if (!descriptionFa.trim() && !descriptionEn.trim()) {
      toast.error("حداقل یکی از توضیحات را وارد کنید (fa یا en).");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // send translated fields as JSON strings so backend can detect objects
      formData.append(
        "title",
        JSON.stringify({ fa: titleFa.trim(), en: titleEn.trim() })
      );
      formData.append(
        "description",
        JSON.stringify({ fa: descriptionFa, en: descriptionEn })
      );
      formData.append(
        "des",
        JSON.stringify({ fa: desFa.trim(), en: desEn.trim() })
      );

      // also include an explicit `translations` object for clarity (backend will accept title/description/des separately)
      formData.append(
        "translations",
        JSON.stringify({
          title: { fa: titleFa.trim(), en: titleEn.trim() },
          description: { fa: descriptionFa, en: descriptionEn },
          des: { fa: desFa.trim(), en: desEn.trim() },
        })
      );

      formData.append("lang", lang); // fallback/original language
      formData.append("status", status.toString());

      files.forEach((file) => formData.append("images", file));
      if (video) formData.append("video", video);

      await api.post("/samples", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("نمونه‌کار جدید با موفقیت ایجاد شد!");
      // reset
      setTitleFa("");
      setTitleEn("");
      setDesFa("");
      setDesEn("");
      setDescriptionFa("");
      setDescriptionEn("");
      setFiles([]);
      setVideo(null);
      window.location.href = "/dashboard/samples";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          toast.error(
            err.response.data?.message ||
              "خطا در ایجاد نمونه‌کار. لطفاً دوباره تلاش کنید."
          );
        } else {
          toast.error("خطای شبکه یا سرور رخ داد.");
        }
      } else {
        toast.error("خطای ناشناخته رخ داد.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        ایجاد نمونه‌کار جدید
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language switcher for editing */}
        <div>
          <label className="block mb-1 font-semibold">
            نمایش و ویرایش زبان
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "fa" | "en")}
            className="w-full border rounded px-3 py-2"
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
            type="text"
            value={titleFa}
            onChange={(e) => setTitleFa(e.target.value)}
            placeholder="عنوان به فارسی"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Title (English)</label>
          <Input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Title in English"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            توضیح خلاصه (فارسی)
          </label>
          <Input
            type="text"
            value={desFa}
            onChange={(e) => setDesFa(e.target.value)}
            placeholder="توضیح کوتاه به فارسی"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Summary (English)</label>
          <Input
            type="text"
            value={desEn}
            onChange={(e) => setDesEn(e.target.value)}
            placeholder="Short description in English"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">توضیحات (فارسی)</label>
          {typeof window !== "undefined" && (
            <RichTextEditor value={descriptionFa} onChange={setDescriptionFa} />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Description (English)
          </label>
          {typeof window !== "undefined" && (
            <RichTextEditor value={descriptionEn} onChange={setDescriptionEn} />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            آپلود تصاویر (images)
          </label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) =>
              setFiles(e.target.files ? Array.from(e.target.files) : [])
            }
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              imageInputRef.current && imageInputRef.current.click()
            }
          >
            انتخاب تصاویر
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                onClick={() =>
                  setFiles((prev) => prev.filter((_, i) => i !== idx))
                }
                title="حذف عکس"
              >
                ×
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id={`replace-image-${idx}`}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFiles((prev) =>
                      prev.map((f, i) => (i === idx ? e.target.files![0] : f))
                    );
                  }
                }}
              />
              <label
                htmlFor={`replace-image-${idx}`}
                className="absolute bottom-1 left-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer"
                title="تعویض عکس"
              >
                ↻
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            آپلود ویدیو (یک عدد)
          </label>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              videoInputRef.current && videoInputRef.current.click()
            }
          >
            انتخاب ویدیو
          </Button>
        </div>

        <div className="mt-4">
          {video && (
            <video
              controls
              src={URL.createObjectURL(video)}
              className="w-full h-auto rounded-md shadow"
            />
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ارسال..." : "ایجاد نمونه‌کار"}
        </Button>
      </form>
    </div>
  );
}
