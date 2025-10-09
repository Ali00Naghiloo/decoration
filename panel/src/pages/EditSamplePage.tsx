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

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const { getSampleById } = await import("@/src/lib/api");
        const data = await getSampleById(id);
        setTitle(data.title);
        setDescription(data.description);
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
        <Button type="submit" disabled={loading}>
          {loading ? "در حال ویرایش..." : "ویرایش"}
        </Button>
      </form>
    </div>
  );
}
