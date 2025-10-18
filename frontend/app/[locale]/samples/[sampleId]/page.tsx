import React from "react";
import SampleDetailPage from "@/src/components/pages/SampleDetailPage";

export default function Page({ params }: { params: { sampleId: string } }) {
  return <SampleDetailPage sampleId={params.sampleId} />;
}
