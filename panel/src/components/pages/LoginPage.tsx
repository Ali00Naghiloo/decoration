"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import toast from "react-hot-toast";
import api from "@/src/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        toast.success("ورود با موفقیت انجام شد!");
        router.push("/dashboard");
      } else {
        toast.error("پاسخ نامعتبر از سرور دریافت شد.");
      }
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "isAxiosError" in err &&
        (err as any).isAxiosError
      ) {
        const apiMsg =
          (err as any).response?.data?.message ||
          (err as any).response?.data?.error ||
          (err as any).message ||
          "ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.";
        // ترجمه خطاها به فارسی
        if (apiMsg.includes("Incorrect username or password")) {
          toast.error("نام کاربری یا رمز عبور اشتباه است.");
        } else if (apiMsg.includes("Please provide a username and password")) {
          toast.error("لطفاً نام کاربری و رمز عبور را وارد کنید.");
        } else if (apiMsg.includes("An admin user already exists")) {
          toast.error("کاربر مدیر قبلاً ساخته شده است.");
        } else {
          toast.error(apiMsg);
        }
      } else {
        toast.error("ورود ناموفق بود. خطای ناشناخته.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-sm mx-auto mt-20 p-8 rounded-xl shadow-lg"
      style={{
        background: "linear-gradient(135deg,#f8fafc 60%,#e0e7ff 100%)",
        border: "1px solid #e0e7ff",
      }}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-center text-[#006FFF]">
        ورود به پنل مدیریت
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="rounded-lg border-gray-300 focus:border-[#006FFF] focus:ring-[#006FFF] font-bold"
        />
        <Input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border-gray-300 focus:border-[#006FFF] focus:ring-[#006FFF] font-bold"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-[#006FFF] text-white font-bold hover:bg-[#0057d9] transition"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </Button>
      </form>
    </div>
  );
}
