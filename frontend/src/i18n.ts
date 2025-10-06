import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async (params: any) => {
  const locale =
    typeof params.requestLocale === "function"
      ? await params.requestLocale()
      : params.locale;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
