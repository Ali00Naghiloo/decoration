import PortfolioPage from "@/src/pages/PortfolioPage";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <>
      <PortfolioPage />
    </>
  );
}
