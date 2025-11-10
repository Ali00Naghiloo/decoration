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
    ssr: false, // This is crucial!
    loading: () => <p>در حال بارگذاری ادیتور...</p>,
  }
);

export default function NewSamplePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [des, setDes] = useState(""); // توضیح خلاصه
  const [lang, setLang] = useState<"fa" | "en">("fa"); // زبان نمونه‌کار
  const [status, setStatus] = useState(1); // وضعیت نمایش
  const [files, setFiles] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("عنوان و توضیحات الزامی است.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("des", des);
      formData.append("lang", lang); // زبان نمونه‌کار
      formData.append("status", status.toString());
      files.forEach((file, idx) => {
        formData.append("images", file);
      });
      if (video) {
        formData.append("video", video);
      }
      await api.post("/samples", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("نمونه‌کار جدید با موفقیت ایجاد شد!");
      setTitle("");
      setDescription("");
      setFiles([]);
      setVideo(null);
      // ریدایرکت به لیست نمونه‌کارها
      window.location.href = "/dashboard/samples";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          toast.error(
            err.response.data?.message ||
              "خطا در ایجاد نمونه‌کار. لطفاً دوباره تلاش کنید."
          );
        } else {
          toast.error("خطای ناشناخته رخ داد.");
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
        <div>
          <label className="block mb-1 font-semibold">
            عنوان نمونه‌کار (title)
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً طراحی سایت فروشگاهی"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            زبان نمونه‌کار (lang)
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
          <label className="block mb-1 font-semibold">توضیح خلاصه (des)</label>
          <Input
            type="text"
            value={des}
            onChange={(e) => setDes(e.target.value)}
            placeholder="توضیح کوتاه برای کارت"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            توضیحات (description)
          </label>
          {typeof window !== "undefined" && (
            <RichTextEditor
              value={description}
              onChange={(content: string) => setDescription(content)}
            />
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
        {/* پیش‌نمایش تصاویر انتخاب‌شده */}
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
              {/* دکمه حذف */}
              <button
                type="button"
                className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                onClick={() => {
                  setFiles((prev) => prev.filter((_, i) => i !== idx));
                }}
                title="حذف عکس"
              >
                ×
              </button>
              {/* دکمه تعویض */}
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
        {/* پیش‌نمایش عکس‌ها کنار دکمه آپلود نمایش داده می‌شود */}
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
