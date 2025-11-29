import React from "react";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import Samples from "@/src/components/sections/Samples";
import SamplesHeroSection from "@/src/components/sections/SamplesHeroSection";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <div className="max-w-[1500px] mx-auto">
        <SamplesHeroSection />
        <Samples />
      </div>
      <Footer />
    </>
  );
}
