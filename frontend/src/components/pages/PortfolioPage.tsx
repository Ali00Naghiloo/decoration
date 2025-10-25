import React from "react";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import PortfolioSamples from "@/src/components/sections/PortfolioSamples";
import HeroSection from "@/src/components/sections/HeroSection";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <div className="max-w-[1500px] mx-auto">
        <HeroSection />
        <PortfolioSamples />
      </div>
      <Footer />
    </>
  );
}
