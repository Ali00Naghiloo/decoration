import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import Samples from "@/src/components/sections/Samples";

export default function SamplesPage() {
  return (
    <>
      <Header />
      <div className="max-w-[1500px] mx-auto">
        <Samples />
      </div>
      <Footer />
    </>
  );
}
