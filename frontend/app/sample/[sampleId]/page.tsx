import SamplePage from "@/src/pages/SamplePage";
import React from "react";

export default function page({ params }: { params: { sampleId: string } }) {
  const { sampleId } = params;

  return (
    <>
      <SamplePage sampleId={sampleId} />
    </>
  );
}
