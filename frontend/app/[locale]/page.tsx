import PortfolioPage from "@/src/components/pages/PortfolioPage";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <>
      <PortfolioPage />
    </>
  );
}
