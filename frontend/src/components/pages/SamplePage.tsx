import React from "react";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import Sample from "@/src/components/sections/Sample";

export default function SamplePage({ sampleId }: { sampleId: string }) {
  return (
    <>
      <Header />
      <Sample sampleId={sampleId} />
      <Footer />
    </>
  );
}
