import { getDictionary } from "@/src/lib/translations";
import PortfolioPage from "@/src/pages/PortfolioPage";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(locale); // Fetch the translations

  return (
    <>
      <h1>{dict.Index?.title}</h1>
      <PortfolioPage />
    </>
  );
}
