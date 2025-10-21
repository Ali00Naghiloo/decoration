import PortfolioPage from "@/src/components/pages/PortfolioPage";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PortfolioPage />
    </>
  );
}
