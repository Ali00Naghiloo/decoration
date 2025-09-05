import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sample from "../components/sections/Sample";

export default function SamplePage({ sampleId }: { sampleId: string }) {
  return (
    <>
      <Header />
      <Sample sampleId={sampleId} />
      <Footer />
    </>
  );
}
