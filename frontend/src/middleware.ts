// src/middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fa"],
  defaultLocale: "en",
});

export const config = {
  // Use the recommended matcher from the official docs
  matcher: ["/", "/(fa|en)/:path*"],
};
