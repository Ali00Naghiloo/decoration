"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/dashboard", label: "داشبورد", icon: Home },
  { href: "/dashboard/samples", label: "نمونه‌کارها", icon: ImageIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  // Prevent body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle sidebar close with animation
  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setOpen(false);
      setAnimateOut(false);
    }, 500); // match animation duration
  };

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="sm:hidden fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
      >
        <Menu className="h-6 w-6" />
      </button>
      {/* Sidebar for desktop */}
      <aside className="hidden sm:flex w-64 flex-shrink-0 bg-gray-800 text-white p-4 flex-col h-screen">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="پنل مدیریت" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold">پنل مدیریت</h1>
        </div>
        <nav className="flex-grow">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 py-2 px-4 rounded transition-colors",
                    pathname === link.href
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Sidebar drawer for mobile */}
      {open && (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex justify-end z-50 transition-all duration-500 ease-in-out">
          <aside
            className={`bg-gray-800 text-white w-3/4 max-w-xs h-full p-4 flex flex-col relative ${
              animateOut ? "animate-slide-out" : "animate-slide-in"
            }`}
          >
            <button
              className="absolute top-4 right-4 text-3xl text-gray-400 cursor-pointer"
              onClick={handleClose}
              aria-label="بستن منو"
            >
              ×
            </button>
            <div className="flex flex-col items-center mb-8">
              <img
                src="/logo.png"
                alt="پنل مدیریت"
                className="w-16 h-16 mb-2"
              />
              <h1 className="text-2xl font-bold">پنل مدیریت</h1>
            </div>
            <nav className="flex-grow">
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 py-2 px-4 rounded transition-colors",
                        pathname === link.href
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      )}
                      onClick={handleClose}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
