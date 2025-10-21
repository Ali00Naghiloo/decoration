import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || "fa"; // Fallback to 'fa' if no locale is provided
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
