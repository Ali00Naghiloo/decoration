// DashboardContent component extracted from /app/dashboard/page.tsx

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSamples } from "@/src/lib/api";
import { Sample } from "@/src/types";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardContent() {
  // آمار نمونه‌کارها
  const { data, isLoading, isError, error } = useQuery<{ items: Sample[] }>({
    queryKey: ["samples"],
    queryFn: getSamples,
  });

  const samples = data?.items || [];

  // محاسبه آمار
  const stats = useMemo(() => {
    const total = samples.length || 0;
    // اگر فیلد status وجود ندارد، همه را فعال فرض می‌کنیم
    const active = total;
    const inactive = 0;
    // تیکت‌ها فعلاً فرضی
    const tickets = 0;
    return { total, active, inactive, tickets };
  }, [samples]);

  if (isLoading) {
    return <div>در حال بارگذاری داشبورد...</div>;
  }

  if (isError) {
    return <div>خطا در دریافت اطلاعات: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">داشبورد مدیریت</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600">
            تعداد کل نمونه‌کارها
          </span>
          <span className="text-3xl font-bold mt-2">{stats.total}</span>
        </Card>
        <Card className="p-5 flex flex-col items-center">
          <span className="text-lg font-semibold text-green-600">فعال</span>
          <span className="text-3xl font-bold mt-2">{stats.active}</span>
        </Card>
        <Card className="p-5 flex flex-col items-center">
          <span className="text-lg font-semibold text-red-600">غیرفعال</span>
          <span className="text-3xl font-bold mt-2">{stats.inactive}</span>
        </Card>
        <Card className="p-5 flex flex-col items-center">
          <span className="text-lg font-semibold text-blue-600">
            تعداد تیکت‌ها
          </span>
          <span className="text-3xl font-bold mt-2">{stats.tickets}</span>
        </Card>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-2">خوش آمدید 👋</h2>
        <p className="text-gray-700 mb-2">
          به پنل مدیریت خوش آمدید! در اینجا می‌توانید آمار کلی نمونه‌کارها و
          تیکت‌ها را مشاهده کنید و به بخش‌های مختلف دسترسی داشته باشید.
        </p>
        <Button asChild>
          <Link
            href="/dashboard/samples/new"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            افزودن نمونه‌کار جدید
          </Link>
        </Button>
      </div>
      {/* سایر محتوای UX دلخواه */}
      <div className="bg-gray-50 rounded-lg p-4 text-gray-600 text-sm">
        <ul className="list-disc pr-5">
          <li>برای افزودن نمونه‌کار جدید، روی دکمه بالا کلیک کنید.</li>
          <li>
            برای مشاهده یا ویرایش نمونه‌کارها، از منوی کناری استفاده کنید.
          </li>
          <li>در صورت نیاز به پشتیبانی، با تیم فنی تماس بگیرید.</li>
        </ul>
      </div>
    </div>
  );
}
