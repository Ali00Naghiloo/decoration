import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import SampleDetail, {
  PortfolioItem,
} from "@/src/components/sections/SampleDetail";
import { apiFetch } from "@/src/lib/api";

interface Props {
  sampleId: string;
}

export default async function SampleDetailPage({ sampleId }: Props) {
  const { data } = await apiFetch(`/samples/${sampleId}`);
  const item: PortfolioItem = data;
  return (
    <>
      <Header />
      <div className="max-w-[1440px] mx-auto">
        <SampleDetail item={item} />
      </div>
      <Footer />
    </>
  );
}
