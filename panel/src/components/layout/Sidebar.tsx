"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/samples", label: "Samples", icon: ImageIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      <nav className="flex-grow">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 py-2 px-4 rounded transition-colors",
                  pathname === link.href
                    ? "bg-gray-700 text-white" // Active link style
                    : "text-gray-400 hover:bg-gray-700 hover:text-white" // Inactive link style
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* You can add a logout button here later */}
    </aside>
  );
}
