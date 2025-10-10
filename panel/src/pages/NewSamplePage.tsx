"use client";
import React, { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

export default function NewSamplePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      files.forEach((file, idx) => {
        formData.append("images", file);
      });
      if (video) {
        formData.append("video", video);
      }
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL + "/samples"
          : "http://localhost:5000/api/samples",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("نمونه‌کار جدید با موفقیت ایجاد شد!");
      setTitle("");
      setDescription("");
      setFiles([]);
      setVideo(null);
      // ریدایرکت به لیست نمونه‌کارها
      window.location.href = "/dashboard/samples";
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "خطا در ایجاد نمونه‌کار. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        ایجاد نمونه‌کار جدید
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">عنوان نمونه‌کار</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً طراحی سایت فروشگاهی"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">توضیحات</label>
          <textarea
            className="w-full rounded-md border px-3 py-2 text-base"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            placeholder="توضیح مختصر درباره نمونه‌کار"
            required
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            آپلود تصاویر (چندتایی)
          </label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setFiles(e.target.files ? Array.from(e.target.files) : [])
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            آپلود ویدیو (یک عدد)
          </label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ارسال..." : "ایجاد نمونه‌کار"}
        </Button>
      </form>
    </div>
  );
}
