import Link from "next/link";

export default function ServerError() {
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
          color: "#ef4444",
          margin: 0,
        }}
      >
        500
      </h1>
      <h2 style={{ fontSize: "2rem", color: "#334155", margin: "1rem 0" }}>
        خطای سرور
      </h2>
      <p style={{ color: "#64748b", marginBottom: "0.5rem" }}>
        سایت با مشکل موقت مواجه شده است. لطفاً بعداً دوباره تلاش کنید.
      </p>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>
        The website is temporarily unavailable. Please try again later.
      </p>
      <Link
        href="/"
        style={{
          padding: "0.75rem 2rem",
          background: "#ef4444",
          color: "#fff",
          borderRadius: "999px",
          fontWeight: "bold",
          fontSize: "1.1rem",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(239,68,68,0.15)",
          transition: "background 0.2s",
        }}
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
