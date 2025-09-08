import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Samples from "../components/sections/Samples";
import HeroSection from "../components/sections/HeroSection";

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
