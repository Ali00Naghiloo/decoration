// LoginPage component extracted from /app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL + "/auth/login"
          : "http://localhost:5000/api/auth/login",
        { username, password }
      );
      if (res.data && res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        toast.success("ورود با موفقیت انجام شد!");
        router.push("/dashboard");
      } else {
        toast.error("پاسخ نامعتبر از سرور دریافت شد.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.";
        toast.error(apiMsg);
      } else {
        toast.error("ورود ناموفق بود. خطای ناشناخته.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">ورود به پنل</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </Button>
      </form>
    </div>
  );
}
