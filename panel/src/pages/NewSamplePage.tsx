"use client";
import React, { useState } from "react";
import RichTextEditor from "@/src/components/forms/RichTextEditor";
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
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
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
          {typeof window !== "undefined" && (
            <RichTextEditor
              value={description}
              onChange={(content: string) => setDescription(content)}
            />
          )}
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
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">پیش‌نمایش</h2>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group flex items-center space-x-2"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", index.toString())
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const draggedIndex = parseInt(
                    e.dataTransfer.getData("text/plain"),
                    10
                  );
                  const updatedFiles = [...files];
                  const [draggedFile] = updatedFiles.splice(draggedIndex, 1);
                  updatedFiles.splice(index, 0, draggedFile);
                  setFiles(updatedFiles);
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-full h-auto rounded-md shadow"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-sm opacity-0 group-hover:opacity-100 transition"
                  onClick={() => {
                    const updatedFiles = files.filter((_, i) => i !== index);
                    setFiles(updatedFiles);
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
            {video && (
              <video
                controls
                src={URL.createObjectURL(video)}
                className="w-full h-auto rounded-md shadow"
              />
            )}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "در حال ارسال..." : "ایجاد نمونه‌کار"}
        </Button>
      </form>
    </div>
  );
}
