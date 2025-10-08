import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async (params: any) => {
  const locale =
    typeof params.requestLocale === "function"
      ? await params.requestLocale()
      : params.locale || "fa"; // Fallback to 'fa' if no locale is provided
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
