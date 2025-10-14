import React from "react";
import Link from "next/link";

interface PortfolioItem {
  _id: string;
  title: string;
  cover?: string;
  description?: string;
}

async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    }/api/portfolio`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data || [];
}

export default async function Page() {
  const items = await getPortfolioItems();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
        نمونه‌کارها
      </h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {items.length === 0 && <div>هیچ نمونه‌کاری ثبت نشده است.</div>}
        {items.map((item) => (
          <Link
            key={item._id}
            href={`./sample/${item._id}`}
            style={{
              display: "block",
              width: 260,
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 16,
              textDecoration: "none",
              color: "#222",
              background: "#fff",
              boxShadow: "0 2px 8px #0001",
              transition: "box-shadow .2s",
            }}
          >
            {item.cover && (
              <img
                src={item.cover}
                alt={item.title}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              />
            )}
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
              {item.title}
            </div>
            {item.description && (
              <div
                style={{
                  color: "#666",
                  fontSize: 15,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
