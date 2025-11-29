"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Samples() {
  useEffect(() => {
    redirect("/samples");
  }, []);

  return null;
}
