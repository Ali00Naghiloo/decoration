// i18n/request.ts
import { getRequestConfig } from "next-intl/server";

const SUPPORTED = ["en", "fa"] as const;

export default getRequestConfig(async ({ locale }) => {
  const finalLocale = SUPPORTED.includes(locale as any) ? locale : "en";

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  };
});
