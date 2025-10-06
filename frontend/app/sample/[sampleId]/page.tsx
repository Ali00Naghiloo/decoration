import SamplePage from "@/src/components/pages/SamplePage";
import React from "react";

export default async function page({
  params,
}: {
  params: { sampleId: string };
}) {
  const { sampleId } = await params;

  return (
    <>
      <SamplePage sampleId={sampleId} />
    </>
  );
}
