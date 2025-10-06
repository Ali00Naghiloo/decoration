import React from "react";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import Samples from "@/src/components/sections/Samples";
import HeroSection from "@/src/components/sections/HeroSection";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <HeroSection />
      <Samples />
      <Footer />
    </>
  );
}
