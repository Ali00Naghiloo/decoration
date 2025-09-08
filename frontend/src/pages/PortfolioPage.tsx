import React from "react";
import Header from "../components/layout/Header";
import Portfolio from "../components/sections/Portfolio";
import Footer from "../components/layout/Footer";
import Samples from "../components/sections/Samples";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <Portfolio />
      <Samples />
      <Footer />
    </>
  );
}
