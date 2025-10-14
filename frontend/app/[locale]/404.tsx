import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
        fontFamily: "inherit",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: "bold",
          color: "#3b82f6",
          margin: 0,
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "2rem", color: "#334155", margin: "1rem 0" }}>
        صفحه مورد نظر پیدا نشد!
      </h2>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>
        متاسفانه صفحه‌ای که دنبال آن بودید وجود ندارد.
      </p>
      <Link
        href="/"
        style={{
          padding: "0.75rem 2rem",
          background: "#3b82f6",
          color: "#fff",
          borderRadius: "999px",
          fontWeight: "bold",
          fontSize: "1.1rem",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(59,130,246,0.15)",
          transition: "background 0.2s",
        }}
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
